const mongoose = require('mongoose');

const InfoFinanca  = mongoose.model('InfoFinanca', {
    idUsuario: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    transacaoId: { type: String, required: true },
    mes: { type: String, required: true },
    ano: { type: String, required: true },
    objetivo: { type: String, required: true },
    saldoExtraPoupanca: Number,
    saldoExtraAlimentacao: Number,
    saldoExtraLazer: Number,
    saldoExtraPasseio: Number,
    saldoExtraOutros: Number
});

module.exports = InfoFinanca