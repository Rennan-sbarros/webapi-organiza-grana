const Financa = require('../../models/financas/Financa');
const InfoFinanca = require('../../models/financas/InfoFinanca');
const Ganhos = require('../../models/financas/Ganhos');
const Despesas = require('../../models/financas/Despesas');
const Categorias = require('../../models/financas/Categoria');

const { v4: uuidv4 } = require('uuid');

exports.adicionarFinancas = async (req, res) => {
    try {
        const { informacoes, ganhos, despesas } = req.body;
        const idUsuario = req.usuario.id;

        const transacaoId = uuidv4();

        const camposObrigatoriosInformacoes = !informacoes.mes || !informacoes.ano || !informacoes.objetivo;
        const camposObrigatoriosGanhos = ganhos.some(ganho => !ganho.origemValor || !ganho.valorGanhos);
        const camposObrigatoriosDespesas = despesas.some(despesa => !despesa.descricaoDespesa || !despesa.valorDespesa);

        if (camposObrigatoriosInformacoes || camposObrigatoriosGanhos || camposObrigatoriosDespesas) {
            return res.status(400).json({ error: 'Todos os campos obrigatórios devem ser preenchidos.' });
        }

        const total = (informacoes.poupanca || 0) + (informacoes.alimentacao || 0) + (informacoes.lazer || 0) + (informacoes.passeio || 0) + (informacoes.outros || 0);

        if (total > 100) {
            return res.status(400).json({ error: 'A soma das porcentagens não pode ser maior que 100%.' });
        }

        for (const despesa of despesas) {
            if (!despesa.categoriaId) {
                return res.status(400).json({ error: 'O campo categoria é obrigatório.' });
            }

            const categoria = await Categorias.findOne({ _id: despesa.categoriaId });
            if (!categoria) {
                return res.status(400).json({ error: 'Categoria não encontrada.' });
            }
        }

        const infoFinanca = new InfoFinanca({
            idUsuario: idUsuario,
            transacaoId: transacaoId,
            mes: informacoes.mes,
            ano: informacoes.ano,
            objetivo: informacoes.objetivo,
            saldoExtraPoupanca: informacoes.poupanca,
            saldoExtraAlimentacao: informacoes.alimentacao,
            saldoExtraLazer: informacoes.lazer,
            saldoExtraPasseio: informacoes.passeio,
            saldoExtraOutros: informacoes.outros
        });

        await infoFinanca.save();

        for (const ganho of ganhos) {
            const ganhoFinanca = new Ganhos({
                idUsuario: idUsuario,
                transacaoId: transacaoId,
                origemValor: ganho.origemValor,
                valorGanhos: ganho.valorGanhos
            });
    
            await ganhoFinanca.save();
        }

        for (const despesa of despesas) {
            const categoria = await Categorias.findOne({ _id: despesa.categoriaId });
            if (!categoria) {
                return res.status(400).json({ error: 'Categoria não encontrada.' });
            }
        
            const despesaFinanca = new Despesas({
                idUsuario,
                transacaoId,
                categoriaDespesa: categoria.categoriaNome, 
                descricaoDespesa: despesa.descricaoDespesa,
                valorDespesa: despesa.valorDespesa,
                categoriaId: despesa.categoriaId
            });
        
            await despesaFinanca.save();
        }

        let totalGanhos = 0;
        for (const ganho of ganhos) {
            totalGanhos += parseFloat(ganho.valorGanhos); 
        }
        
        let totalDespesas = 0;
        for (const despesa of despesas) {
            totalDespesas += parseFloat(despesa.valorDespesa); 
        }
        
        const totalGanhosFormatado = totalGanhos.toFixed(2).replace(",", ".");
        const totalDespesasFormatado = totalDespesas.toFixed(2).replace(",", ".");
        
        const financa = new Financa({
            idUsuario: idUsuario,
            transacaoId: transacaoId,
            periodoMes: informacoes.mes,
            periodoAno: informacoes.ano,
            objetivo: informacoes.objetivo,
            totalGanhos: totalGanhosFormatado,
            totalDespesas: totalDespesasFormatado
        });
        
        await financa.save();
        

        res.status(201).json({ message: 'Informações de finanças adicionadas com sucesso!' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao adicionar informações de finanças.' });
    }
}