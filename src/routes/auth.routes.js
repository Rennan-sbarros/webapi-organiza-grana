const express = require('express')
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/registro', authController.registroUsuario);
router.post('/login', authController.loginUsuario);

module.exports = router;
