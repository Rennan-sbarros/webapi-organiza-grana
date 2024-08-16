const mongoose = require('mongoose');

const conectarBancoDados = async () => {
    try {
        const dbUser = process.env.DB_USER;
        const dbPassword = process.env.DB_PASS;
        const dbURI = `mongodb+srv://${dbUser}:${dbPassword}@clusterorganizagrana.lzwypgv.mongodb.net/?retryWrites=true&w=majority`;

        await mongoose.connect(dbURI);
        console.log('Conectado ao banco de dados');
    } catch (error) {
        console.error('Erro ao conectar ao banco de dados:', error);
    }
};

module.exports = conectarBancoDados;
