const bcrypt = require('bcrypt');
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
        if (error.name === 'Erro') {
            return res.status(422).json({ msg: 'Erro de validação', errors: error.errors });
        }
        res.status(500).json({msg: "Erro no servidor, tente novamente mais tarde!"})
    }
}

