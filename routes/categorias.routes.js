const express = require('express')
const router = express.Router();

const categorias = require('../controllers/financas/categoriasController');

router.post('/adicionarCategorias', categorias.adicionarCategoria);

router.get('/', categorias.listaCategorias);

module.exports = router;
