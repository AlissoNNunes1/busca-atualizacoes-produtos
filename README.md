
# Automatização de Busca de Atualizações de Produtos

O intuito deste projeto é automatizar a verificação diária de alterações e atualizações em produtos, assegurando precisão e eficiência nas decisões ao identificar prontamente qualquer mudança relevante nos itens comercializados. A solução desenvolvida em Node.js substitui um processo manual anteriormente utilizado.

---

## Pré-requisitos

Para executar este projeto, é necessário possuir:

- Node.js (versão 20.13.1)
- npm ou yarn
- dotenv para gerenciar variáveis de ambiente

---

## Instalação e Configuração

### Clonando o Repositório:
```bash
git clone https://github.com/AlissoNNunes1/busca-atualizacoes-produtos.git
```

### Navegando até o diretório do projeto clonado:
```bash
cd busca-atualizacoes-produtos
```

### Instalando as Dependências:

Com npm:
```bash
npm install
```

Com yarn:
```bash
yarn install
```

### Configurando Variáveis de Ambiente:

Crie um arquivo `.env` na raiz do projeto e configure as seguintes variáveis:
```
API_EMAIL=seu-email-de-api
API_PASSWORD=sua-senha-de-api
```

---

## Execução

### Executando o Servidor de Desenvolvimento:

Com npm:
```bash
npm start
```

Ou diretamente com Node.js:
```bash
node app.js
```

O servidor estará disponível em [http://localhost:3000](http://localhost:3000).

---

## Deploy

Para realizar o deploy da aplicação, siga estes passos:

1. Verifique se todas as dependências estão instaladas.
2. Configure as variáveis de ambiente no servidor de produção.
3. Execute o comando de start:
```bash
node app.js
```

---

## Uso

Acesse: [http://localhost:3000](http://localhost:3000) para utilizar a aplicação, onde o endpoint retornará os produtos atualizados com seus detalhes.

---

## Tecnologias Utilizadas

- Node.js
- Express
- Axios
- dotenv
- swagger-jsdoc
- swagger-ui-express
- node-cron

---

## Estrutura do Projeto

- `app.js`: Configuração principal do servidor e definição das rotas.
- `service.js`: Módulo de serviço para autenticação e busca de dados na API externa.
- `package.json`: Arquivo de configuração de dependências do projeto.
- `package-lock.json`: Arquivo que mantém as versões exatas das dependências instaladas para garantir consistência.
- `swaggerConfig.js`: Configuração do Swagger para documentação da API.```
