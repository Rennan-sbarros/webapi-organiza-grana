const revogados = new Set();

const adicionarTokenNaListaNegra = (token) => {
    revogados.add(token);
};

const verificarTokenNaListaNegra = (token) => {
    return revogados.has(token);
};

module.exports = {
    adicionarTokenNaListaNegra,
    verificarTokenNaListaNegra
};
