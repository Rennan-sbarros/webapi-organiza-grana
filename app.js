require('dotenv').config();
const express = require('express')
const conectarBancoDados = require('./db');

const authRoutes = require('./routes/auth.routes');
const financasRoutes = require('./routes/financas.routes');
const categoriasRoutes = require('./routes/categorias.routes');

const app = express()

app.use(express.json())

app.get('/', (req, res) =>{
    res.status(200).json({msg: 'Bem vindo a nossa API'})
})

app.use('/auth', authRoutes);

app.use('/financas', financasRoutes);

app.use('/categorias', categoriasRoutes);

conectarBancoDados().then(() => {
    app.listen(3000, () => {
        console.log('Servidor em execução na porta 3000');
    });
});
