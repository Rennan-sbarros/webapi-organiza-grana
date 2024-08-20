const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true,
        maxlength: 255
    },
    email: {
        type: String,
        required: true,
        maxlength: 254,
        unique: true
    },
    senha: {
        type: String,
        required: true,
        maxlength: 60
    },
    genero: {
        type: String,
        maxlength: 10
    },
    foto_perfil: {
        type: String,
        maxlength: 10
    },
    regiao: {
        type: String,
        maxlength: 10
    },
    tema: {
        type: String,
        maxlength: 10
    },
    provedor: {
        type: String,
        default: 'local' 
    },
    primeiro_login: {
        type: Boolean,
        default: true
    },
    recoveryToken: {
        type: String,
        default: null
    },
    recoveryTokenExpires: {
        type: Date,
        default: null
    },
    criado_em: {
        type: Date,
    },
    atualizado_em: {
        type: Date,
    }
}, {
    timestamps: { createdAt: 'criado_em', updatedAt: 'atualizado_em' } 
});

const User = mongoose.model('User', userSchema);

module.exports = User;
