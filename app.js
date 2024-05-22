
const express = require("express");
const swaggerUi = require("swagger-ui-express");
const specs = require("./swaggerConfig");
const cron = require('node-cron');
const NodeCache = require('node-cache');
const { listarProdutos, detalhesProduto, autenticar } = require("./service");
const cron = require("node-cron");
const { listarProdutos, detalhesProduto, autenticar } =
  require("./service");
 
const app = express();

const cache = new NodeCache({ stdTTL: 3600 }); // Cache com TTL de 1 hora

const obterDataAtual = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  return `${year}${month}${day}${"00"}${"00"}${"00"}`;
};

// Middleware para medir o tempo de resposta
app.use((req, res, next) => {
  const start = process.hrtime();
  res.on('finish', () => {
    const elapsed = process.hrtime(start);
    const elapsedMs = elapsed[0] * 1000 + elapsed[1] / 1e6;
    console.log(`Tempo de resposta para [${req.method}] ${req.originalUrl}: ${elapsedMs.toFixed(3)} ms`);
  });
  next();
});

// Definindo a tarefa agendada para ser executada à meia-noite todos os dias
cron.schedule('0 0 * * *', async () => {
  try {
    const token = await autenticar();
    const dataAtual = obterDataAtual();
    const gtinsAtualizados = await listarProdutos(dataAtual, token);
    const detalhesProdutos = await Promise.all(
      gtinsAtualizados.map(gtin => detalhesProduto(gtin.gtin, token))
    );
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

    // Verifica se os dados estão no cache
    const cacheKey = `produtos-${dataAtual}`;
    let detalhesProdutos = cache.get(cacheKey);

    if (!detalhesProdutos) {
      // Lista os produtos atualizados no dia
      const gtinsAtualizados = await listarProdutos(dataAtual, token);

      // Array que armazena o detalhe dos produtos
      detalhesProdutos = await Promise.all(
        gtinsAtualizados.map(gtin => detalhesProduto(gtin.gtin, token))
      );

      // Armazena os detalhes no cache
      cache.set(cacheKey, detalhesProdutos);
      console.log("Dados armazenados no cache");
    } else {
      console.log("Dados recuperados do cache");
    }

    res.json(detalhesProdutos);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar produtos atualizados" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
