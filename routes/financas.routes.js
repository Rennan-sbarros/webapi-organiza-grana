const express = require('express')
const router = express.Router();

const authController = require('../controllers/authController');
const cadastroFinancaController = require('../controllers/financas/cadastroFinancaController');
const listaFinancasPorUsuario = require('../controllers/financas/listaFinancasByIdUsuarioController');
const deletarFinancaByFinancaId = require('../controllers/financas/deletarFinancaController');

router.post('/cadastro', authController.checkToken, cadastroFinancaController.adicionarFinancas);

router.get('/', authController.checkToken, listaFinancasPorUsuario.getFinancasByIdUsuario);

router.delete('/deletar/:financaId', authController.checkToken, deletarFinancaByFinancaId.deletarFinancaByFinancaId);

module.exports = router;
