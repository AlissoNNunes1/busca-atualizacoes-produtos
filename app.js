// app.js
// Importar o módulo de renderização de templates EJS
const ejs = require("ejs");
const express = require("express");
const { listarProdutos, detalhesProduto, autenticar } =
  require("./service");
const app = express();
const now = new Date();
const year = now.getFullYear();
const month = (now.getMonth() + 1).toString().padStart(2, "0");
let day = now.getDate();
const diaAnterior = day.toString().padStart(2, "0");

const dataAtual = `${year}${month}${diaAnterior}${"00"}${"00"}${"00"}`;

// Rota que retorna os produtos atualizados no dia com informações
app.get("/", async (req, res) => {
  try {
    const token = await autenticar();

    // Lista os produtos atualizados no dia
    const gtinsAtualizados = await listarProdutos(dataAtual, token);

    // Array que armazena o detalhe dos produtos
    const detalhesProdutos = [];

    //Intera sobre cada GTIN e realiza a busca sobre os detalhes de cada um
    for (const gtin of gtinsAtualizados) {
      const code = gtin.gtin;
      console.log(code);
      const detalhes = await detalhesProduto(code, token);
      
      detalhesProdutos.push(detalhes);
      
      // if (contagem > 5) break;
      // contagem++;
    }

    // Renderizar o template 'index' e passar a variável 'produtos' para o template
    // res.json(detalhesProdutos);
    res.json(detalhesProdutos);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar produtos atualizados" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
