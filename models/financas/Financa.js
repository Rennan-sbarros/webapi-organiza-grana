const mongoose = require('mongoose');

const Financa  = mongoose.model('Financa', {
    idUsuario: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    transacaoId: { type: String, required: true },
    periodoMes: String,
    periodoAno: String,
    objetivo: String,
    totalGanhos: String,
    totalDespesas: String
});

module.exports = Financa