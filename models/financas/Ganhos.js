const mongoose = require('mongoose');

const Ganhos  = mongoose.model('Ganhos', {
    idUsuario: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    transacaoId: { type: String, required: true },
    origemValor: String,
    valor: String,
    valorGanhos: String
});

module.exports = Ganhos