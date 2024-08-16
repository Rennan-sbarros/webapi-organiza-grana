const express = require('express')
const router = express.Router();
const userController = require('../controllers/usuario/userController');
const authController = require('../controllers/usuario/authController');

router.post('/registro', userController.registroUsuario);
router.post('/login', userController.loginUsuario);
router.get('/usuario/:id', authController.checkToken, authController.rotaPrivada);

module.exports = router;
