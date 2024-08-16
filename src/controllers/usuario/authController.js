const User = require('../../models/User');
const jwt = require('jsonwebtoken')

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

