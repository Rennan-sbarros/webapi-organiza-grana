const mongoose = require('mongoose');

const Despesas  = mongoose.model('Despesas', {
    idUsuario: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    transacaoId: { type: String, required: true },
    categoriaDespesa: String,
    descricaoDespesa: String,
    valorDespesa: String
});

module.exports = Despesas