const mongoose = require('mongoose');

const Ganhos  = mongoose.model('Ganhos', {
    idUsuario: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    transacaoId: { type: String, required: true },
    origemValor: { type: String, required: true },
    valorGanhos: { type: String, required: true }
});

module.exports = Ganhos