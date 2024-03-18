const mongoose = require('mongoose');

const Categorias  = mongoose.model('Categorias', {
    categoriaNome: { type: String, required: true }
});

module.exports = Categorias