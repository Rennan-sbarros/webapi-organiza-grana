const Categorias = require('../../models/financas/Categoria');

exports.adicionarCategoria = async (req, res) => {
    try {
        const categorias = req.body;

        for (const categoria of categorias) {
            const novaCategoria = new Categorias({
                categoriaNome: categoria.categoriaNome,
            });

            await novaCategoria.save();
        }

        res.status(201).json({ message: 'Categorias adicionadas com sucesso!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao adicionar categorias.' });
    }
}

exports.listaCategorias = async (req, res) => {
    try {
        const categorias = await Categorias.find({}, '-__v');
        res.status(200).json(categorias);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar categorias' });
    }
}