const jwt = require('jsonwebtoken')
const { verificarTokenNaListaNegra } = require('../../services/tokenService');

exports.checkToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ msg: 'Acesso negado' });
    }

    if (verificarTokenNaListaNegra(token)) {
        return res.status(401).json({ msg: 'Token revogado' });
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

