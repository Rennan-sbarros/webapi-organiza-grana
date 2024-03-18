const mongoose = require('mongoose');

const InfoFinanca  = mongoose.model('InfoFinanca', {
    idUsuario: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    transacaoId: { type: String, required: true },
    mes: String,
    ano: String,
    objetivo: String,
    saldoExtraPoupanca: Number,
    saldoExtraAlimentacao: Number,
    saldoExtraLazer: Number,
    saldoExtraPasseio: Number,
    saldoExtraOutros: Number
});

module.exports = InfoFinanca