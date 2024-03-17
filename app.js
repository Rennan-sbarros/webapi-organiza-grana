require('dotenv').config();
const express = require('express')
const conectarBancoDados = require('./db');

const authController = require('./controllers/authController');
const cadastroFinancaController = require('./controllers/financas/cadastroFinancaController');

const app = express()

app.use(express.json())

app.get('/', (req, res) =>{
    res.status(200).json({msg: 'Bem vindo a nossa API'})
})

app.post('/auth/registro', authController.registroUsuario);

app.post('/auth/login', authController.loginUsuario);

app.get('/usuario/:id', authController.checkToken, authController.rotaPrivada);

app.post('/cadastroFinanca', authController.checkToken, cadastroFinancaController.adicionarFinancas);

conectarBancoDados().then(() => {
    app.listen(3000, () => {
        console.log('Servidor em execução na porta 3000');
    });
});
