const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require('jsonwebtoken')

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
    } catch(error) {
        if (error.name === 'Erro') {
            return res.status(422).json({ msg: 'Erro de validação', errors: error.errors });
        }
        res.status(500).json({msg: "Erro no servidor, tente novamente mais tarde!"})
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

