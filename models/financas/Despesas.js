const mongoose = require('mongoose');

const Despesas  = mongoose.model('Despesas', {
    idUsuario: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    transacaoId: { type: String, required: true },
    categoriaDespesa: String,
    descricaoDespesa: { type: String, required: true },
    valorDespesa: { type: String, required: true }
});

module.exports = Despesas