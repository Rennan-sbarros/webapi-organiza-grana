const Financa = require('../../models/financas/Financa');
const Ganhos = require('../../models/financas/Ganhos');
const Despesas = require('../../models/financas/Despesas');

exports.getFinancasByIdUsuario = async (req, res) => {
    const userId = req.usuario.id;

    try {
        const financas = await Financa.find({ idUsuario: userId }, '-__v');

        if (!financas || financas.length === 0) {
            return res.status(404).json({ msg: 'Finanças não encontradas para este usuário' });
        }

        const financasCompletas = [];
        for (const financa of financas) {
            const ganhos = await Ganhos.find({ transacaoId: financa.transacaoId }, '-idUsuario -transacaoId -__v');
            const despesas = await Despesas.find({ transacaoId: financa.transacaoId }, '-idUsuario -transacaoId -__v' );
            const financaCompleta = {
                ...financa.toObject(), 
                ganhos: ganhos,
                despesas: despesas
            };

            financasCompletas.push(financaCompleta);
        }
        
        res.status(200).json(financasCompletas);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar finanças do usuário' });
    }
};