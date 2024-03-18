const mongoose = require('mongoose');

const Financa  = mongoose.model('Financa', {
    idUsuario: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    transacaoId: { type: String, required: true },
    periodoMes: { type: String, required: true },
    periodoAno: { type: String, required: true },
    objetivo: { type: String, required: true },
    totalGanhos: { type: String, required: true },
    totalDespesas: { type: String, required: true }
});

module.exports = Financa