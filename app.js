// Importar o módulo de renderização de templates EJS
const ejs = require('ejs');
const express = require('express');
const { listarProdutos, detalhesProdutos } = require('./service');
const app = express();

// Rota que retorna os produtos atualizados no dia com informações
app.get('/', async (req, res) => {
    try {
        // Lista os produtos atualizados no dia
        const gtinsAtualizados = await listarProdutos();

        // Array que armazena o detalhe dos produtos
        const detalhesProdutos = [];

        //Intera sobre cada GTIN e realiza a busca sobre os detalhes de cada um
        for (const gtin of gtinsAtualizados) {
            const detalhes = await detalhesProdutos(gtin);
            
            detalhesProdutos.push(detalhes);
        }
        console.log(detalhesProdutos)
        // Renderizar o template 'index' e passar a variável 'produtos' para o template
        res.json(detalhesProdutos);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar produtos atualizados' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
