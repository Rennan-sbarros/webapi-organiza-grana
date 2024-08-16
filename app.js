require('dotenv').config();
const express = require('express')
const cors = require('cors');

const conectarBancoDados = require('./db');

const app = express()

app.use(cors());

app.use(express.json())

app.get('/', (req, res) =>{
    res.status(200).json({msg: 'Bem vindo a nossa API'})
})

conectarBancoDados().then(() => {
    app.listen(3000, () => {
        console.log('Servidor em execução na porta 3000');
    });
});
