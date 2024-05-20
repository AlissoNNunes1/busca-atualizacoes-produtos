// app.js
// Importar o módulo de renderização de templates EJS
const ejs = require("ejs");
const express = require("express");
const swaggerUi = require("swagger-ui-express");
const specs = require("./swaggerConfig");
const { listarProdutos, detalhesProduto, autenticar } =
  require("./service");
const app = express();
const obterDataAtual = ()=> {
const now = new Date();
const year = now.getFullYear();
const month = (now.getMonth() + 1).toString().padStart(2, '0');
const day = now.getDate().toString().padStart(2, '0');
return `${year}${month}${day}${"00"}${"00"}${"00"}`;
}


 // Definindo a tarefa agendada para ser executada à meia-noite todos os dias
cron.schedule('0 0 * * *', async () => {
  try {
    const token = await autenticar();
    const dataAtual = obterDataAtual();
    const gtinsAtualizados = await listarProdutos(dataAtual, token);
    const detalhesProdutos = [];

    for (const gtin of gtinsAtualizados) {
      const code = gtin.gtin;
      console.log(code);
      const detalhes = await detalhesProduto(code, token);
      detalhesProdutos.push(detalhes);
    }

    console.log("Tarefa agendada executada com sucesso");
  } catch (error) {
    console.error("Erro ao executar a tarefa agendada:", error.message);
  }
});

// Rota para acessar a documentação do Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// Rota que retorna os produtos atualizados no dia com informações
app.get("/", async (req, res) => {
  try {
    const token = await autenticar();
    const dataAtual = obterDataAtual();

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
