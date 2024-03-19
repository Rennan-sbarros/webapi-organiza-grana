const Financa = require('../../models/financas/Financa');
const Ganhos = require('../../models/financas/Ganhos');
const Despesas = require('../../models/financas/Despesas');
const InfoFinanca = require('../../models/financas/InfoFinanca');

exports.deletarFinancaByFinancaId = async (req, res) => {
    const userId = req.usuario.id;
    const financaId = req.params.financaId; 

    try {
        const financa = await Financa.findOne({ _id: financaId, idUsuario: userId });
        if (!financa) {
            return res.status(404).json({ msg: 'Finança não encontrada para este usuário' });
        }

        await Ganhos.deleteMany({ transacaoId: financa.transacaoId });
        await Despesas.deleteMany({ transacaoId: financa.transacaoId });
        await InfoFinanca.deleteMany({ transacaoId: financa.transacaoId });
        await Financa.deleteOne({ _id: financaId });

        res.status(200).json({ msg: 'Finança excluída com sucesso' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao excluir finança' });
    }
};
