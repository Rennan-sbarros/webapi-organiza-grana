const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const User = require('../models/User');

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
        res.status(500).json({msg: "Erro no servidor, tente novamente mais tarde!"})
    }
}

exports.loginUsuario = async (req, res) => {
    const { email, senha } = req.body;

    if(!email || !senha) {
        return res.status(422).json({msg: 'Todos os campos são obrigatórios!'});
    }

    const usuario = await User.findOne({ email: email })

    if(!usuario) {
        return res.status(404).json({msg: 'Usuário não encontrado'})
    }

    const checkSenha = await bcrypt.compare(senha, usuario.senha)
    if(!checkSenha) {
        return res.status(422).json({msg: 'Senha inválida'})
    }

    try {
        const secret = process.env.SECRET
        const token = jwt.sign({
            id: usuario._id
        }, secret,)

        res.status(200).json({msg: "Autenticação realizada com sucesso!", token})

    } catch(error) {
        res.status(500).json({msg: "Erro no servidor, tente novamente mais tarde!"})
    }
}

exports.rotaPrivada = async (req, res) => {
    const id = req.params.id

    const usuario = await User.findById(id, '-senha')

    if(!usuario){
        return res.status(404).json({msg: 'Usuário não encontrado'})
    }

    res.status(200).json({ usuario })
}

exports.checkToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ msg: 'Acesso negado' });
    }

    try {
        const secret = process.env.SECRET;
        const decoded = jwt.verify(token, secret);
        req.usuario = decoded;
        next();
    } catch (error) {
        res.status(400).json({ msg: "Token inválido" });
    }
};
