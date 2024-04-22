// Importar o módulo de renderização de templates EJS
const ejs = require('ejs');
const express = require('express');
const app = express();

// Importar a função buscarProdutos do service.js
const { buscarProdutos } = require('./service');

app.set('view engine', 'ejs');

app.get('/', async (req, res) => {
    try {
        // Buscar os produtos
        const { produtos } = await buscarProdutos();

        // Renderizar o template 'index' e passar a variável 'produtos' para o template
        res.render('index', { produtos });
    } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        res.status(500).send('Erro ao buscar produtos');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
