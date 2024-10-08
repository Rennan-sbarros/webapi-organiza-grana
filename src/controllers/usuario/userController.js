const bcrypt = require('bcrypt');
const crypto = require('crypto');
const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { adicionarTokenNaListaNegra } = require('../../services/tokenService');

const CAMPOS_NAO_PERMITIDOS = ['senha', 'provedor', 'primeiro_login', 'criado_em', 'atualizado_em'];

const obterCamposExcluidos = () => {
    return CAMPOS_NAO_PERMITIDOS.concat('__v').map(campo => '-' + campo).join(' ');
};

const formatarErrosValidacao = (errors) => {
    const mensagensErro = {};

    for (const [campo, erro] of Object.entries(errors)) {
        if (erro.kind === 'maxlength') {
            mensagensErro[campo] = `Dados inválidos. O campo ${campo} deve ter no máximo ${erro.properties.maxlength} caracteres.`;
        } else if (erro.kind === 'required') {
            mensagensErro[campo] = `Dados inválidos. O campo ${campo} é obrigatório.`;
        } else {
            mensagensErro[campo] = `Dados inválidos para o campo ${campo}.`;
        }
    }

    return mensagensErro;
};

exports.registroUsuario = async (req, res) => {
    const { nome, email, senha, confirmacaoSenha } = req.body;

    if(!nome || !email || !senha || !confirmacaoSenha) {
        return res.status(422).json({msg: 'Todos os campos são obrigatórios!'});
    }

    if(senha !== confirmacaoSenha) {
        return res.status(422).json({msg: 'A senha não confere!'})
    }

    const emailExiste = await User.findOne({ email: email })

    if(emailExiste) {
        return res.status(422).json({msg: 'Email já cadastrado no sistema'})
    }

    const salt = await bcrypt.genSalt(12)
    const passwordHash = await bcrypt.hash(senha, salt)

    const user = new User({
        nome, 
        email,
        senha: passwordHash,
    })

    try{
        await user.save()
        res.status(201).json({msg: "Usuário criado com sucesso!"})
    } catch (error) {
        if (error.name === 'ValidationError') {
            const errosFormatados = formatarErrosValidacao(error.errors);
            return res.status(422).json({ msg: 'Erro de validação', errors: errosFormatados });
        }
        res.status(500).json({ msg: "Erro no servidor, tente novamente mais tarde!" });
    }
}

exports.loginUsuario = async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(422).json({ msg: 'Todos os campos são obrigatórios!' });
    }

    try {
        const usuario = await User.findOne({ email: email });

        if (!usuario) {
            return res.status(404).json({ msg: 'Usuário não encontrado' });
        }
    
        const checkSenha = await bcrypt.compare(senha, usuario.senha);
        if (!checkSenha) {
            return res.status(422).json({ msg: 'Senha inválida' });
        }

        const secret = process.env.SECRET;
        if (!secret) {
            return res.status(500).json({ msg: 'Erro interno do servidor. Contate o administrador.' });
        }

        const token = jwt.sign({
            id: usuario._id
        }, secret, { expiresIn: '24h' }); 

        if (usuario.primeiro_login) {
            usuario.primeiro_login = false;
            await usuario.save();
        }

        res.status(200).json({ msg: "Autenticação realizada com sucesso!", token });

    } catch (error) {
        console.error('Erro ao realizar login:', error);
        res.status(500).json({ msg: "Erro no servidor, tente novamente mais tarde!" });
    }
}

exports.logoutUsuario = async (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(400).json({ msg: 'Token não fornecido' });
    }

    try {
        adicionarTokenNaListaNegra(token);
        
        res.status(200).json({ msg: 'Logout realizado com sucesso!' });
    } catch (error) {
        console.error('Erro ao realizar logout:', error);
        res.status(500).json({ msg: 'Erro no servidor, tente novamente mais tarde!' });
    }
};

exports.usuarioById = async(req, res) => {
    const { id } = req.params;

    try{
        const usuario = await User.findById(id).select(obterCamposExcluidos());

        if(!usuario){
            res.status(404).json({msg: 'Usuário não encontrado'});
        }

        res.status(200).json(usuario);
    } catch{

    }
}

exports.atualizarUsuario = async(req, res) => {
    const { id } = req.params;
    const usuario = req.body;

    CAMPOS_NAO_PERMITIDOS.forEach(campo => {
        delete usuario[campo]
    })

    try {
        const usuarioAtualizado = await User.findByIdAndUpdate(id, usuario, {
            new: true,
            runValidators: true
        }).select(obterCamposExcluidos());

        if (!usuarioAtualizado) {
            return res.status(404).json({ msg: 'Usuário não encontrado' });
        }
        
        await usuarioAtualizado.validate();

        res.status(200).json({ msg: 'Usuário atualizado com sucesso!', usuarioAtualizado})
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(422).json({ msg: 'Dados inválidos', errors: formatarErrosValidacao(error.errors) });
        }
        res.status(500).json({ msg: 'Erro no servidor, tente novamente mais tarde!' });
    }
}

exports.recuperarSenha = async(req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ msg: 'Email é obrigatório.' });
    }

    try{
        const usuario = await User.findOne({ email });

        if (!usuario) {
            return res.status(404).json({ msg: 'Usuário não encontrado.' });
        }

        const token = crypto.randomBytes(32).toString('hex');
        const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex');
        const expiraEm = Date.now() + 3600000; 

        usuario.recoveryToken = resetTokenHash;
        usuario.recoveryTokenExpires = expiraEm;
        await usuario.save();

        const transporter = nodemailer.createTransport({
            service: 'hotmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            to: email,
            from: process.env.EMAIL_USER,
            subject: 'Recuperação de Senha',
            text: `Você solicitou a recuperação de senha para sua conta.\n\n` +
                  `Por favor, clique no link abaixo ou cole-o em seu navegador para concluir o processo:\n\n` +
                  `http://${req.headers.host}/resetar-senha/${token}\n\n` +
                  `Se você não solicitou uma recuperação de senha, por favor, ignore este e-mail.\n`
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ msg: 'E-mail de recuperação enviado com sucesso.' });
    }catch (error) {
        res.status(500).json({ msg: 'Erro ao tentar enviar o e-mail de recuperação.' });
    }
}

exports.resetarSenha = async (req, res) => {
    const { token } = req.params;
    const { senha, confirmacaoSenha } = req.body;

    if (!senha || !confirmacaoSenha) {
        return res.status(400).json({ msg: 'Senha e confirmação de senha são obrigatórios.' });
    }

    if (senha !== confirmacaoSenha) {
        return res.status(400).json({ msg: 'As senhas não coincidem.' });
    }

    try {
        const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex');

        const usuario = await User.findOne({
            recoveryToken: resetTokenHash,
            recoveryTokenExpires: { $gt: Date.now() }
        });

        if (!usuario) {
            return res.status(400).json({ msg: 'Token inválido ou expirado.' });
        }

        usuario.senha = await bcrypt.hash(senha, 12);
        usuario.recoveryToken = null;
        usuario.recoveryTokenExpires = null;
        await usuario.save();

        res.status(200).json({ msg: 'Senha alterada com sucesso.' });
    } catch (error) {
        res.status(500).json({ msg: 'Erro ao tentar resetar a senha.' });
    }
};