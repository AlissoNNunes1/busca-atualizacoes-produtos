//service.js
const now = new Date();
const year = now.getFullYear();
const month = (now.getMonth() + 1).toString().padStart(2, '0');
const day = now.getDate().toString().padStart(2, '0');


const dataAtual = `${year}${month}${day}${"00"}${"00"}${"00"}`;
let codigosGTIN = [];

const axios = require('axios');
require('dotenv').config();

const baseURL = 'https://prod-api-v4.simplustec.com.br';
const apiEmail = process.env.API_EMAIL;
const apiPassword = process.env.API_PASSWORD;

const api = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json'
    }
});

async function autenticar() {
    try {
        // Enviar solicitação POST para jwt-login endpoint com as credenciais
        const response = await api.post('/jwt-login', {
            email: apiEmail,
            password: apiPassword
        });

        // Retornar o token JWT da resposta
        return response.data.token;
    } catch (error) {
        // Lidar com erros de autenticação
        console.error('Erro na autenticação:', error.response ? error.response.data.errorMessage : error.message);
        throw error;
    }
}

// Exemplo de uso da função de autenticação
async function exemploAutenticacao() {
    try {
        const token = await autenticar();
        console.log('Token JWT:', token);
    } catch (error) {
        console.error('Erro durante a autenticação:', error.message);
    }
}

async function listarProdutos(dataAtual) {
    try {
        const token = await autenticar();
        const response = await api.get(`/products-published?ultimaAtualizacao=${dataAtual}&mostrarInativos=false&mostrarDescricao=true`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        
        
        // Verifica se a resposta contém dados
        if (response.data && response.data.length > 0) {
            // Armazenar os GTINs na lista codigosGTIN
            codigosGTIN = response.data.map(produto => produto.gtin);
           
            // Retorna uma lista de objetos contendo GTIN e descrição de cada produto
            return response.data.map(produto => ({
                gtin: produto.gtin,
                
            }));
            
        } else {
            console.error('Erro ao listar produtos: resposta vazia');
            return []; // Retorna uma lista vazia em caso de resposta vazia
        }
    } catch (error) {
        console.error('Erro ao listar produtos:', error.response ? error.response.data : error.message);
        throw error;
    }
}


async function detalhesProduto(gtin) {
    try {
        const token = await autenticar();
        const response = await api.get(`/product?gtin=${gtin}&noAgreement=true`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        // Extrair os detalhes relevantes do produto da resposta
        const detalhes = response.data;

        console.log(detalhes)
        
        return detalhes;
        
    } catch (error) {
        console.error('Erro ao buscar detalhes do produto:', error.message);
        throw error;
    }
}



async function buscarProdutos() {
    try {
        // Obter os GTINs dos produtos
        const gtins = await listarProdutos(dataAtual);
        console.log(gtins);
        // Array para armazenar os detalhes de todos os produtos
        const detalhesProdutos = [];

        // Iterar sobre cada GTIN e buscar seus detalhes
        for (const gtin of gtins) {
            const detalhes = await detalhesProduto(gtin);
            detalhesProdutos.push(detalhes);
        }

        // Criar um objeto JSON com os detalhes de todos os produtos
        const jsonDetalhesProdutos = {
            produtos: detalhesProdutos
        };
        console.log(jsonDetalhesProdutos)
        return jsonDetalhesProdutos;
        
    } catch (error) {
        console.error('Erro ao buscar produtos:', error.response ? error.response.data : error.message);
        throw error;
    }
}


exemploAutenticacao();
module.exports = {
    listarProdutos,
    buscarProdutos,
    codigosGTIN
};
