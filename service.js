//service.js


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
        console.log('a minha função foi chamada')

        // Retornar o token JWT da resposta
        return response.data.token;
        
    } catch (error) {

        // Lidar com erros de autenticação
        console.error('Erro na autenticação:', error.response ? error.response.data.errorMessage : error.message);
        throw error;
    }
}



async function listarProdutos(dataAtual, token) {
    try {
        

        const response = await api.get(`/products-published?ultimaAtualizacao=${dataAtual}`, {
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


async function detalhesProduto(gtin, token) {
    try {
        
        const response = await api.get(`/product?gtin=${gtin}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });


        //console.log(response.data);

        // Extrair os detalhes relevantes do produto da resposta
        const detalhes = response.data.map(produto => ({

            gtin: produto.gtin,
            descricao: produto.descricao,
            marca: produto.marca ? produto.marca.submarca : null,
            submarca: produto.marca ? produto.marca.submarca : null,
            codigoInterno: produto.codigoInterno,
            categoriaProduto: produto.categoriaProduto ? produto.categoriaProduto.nome : null,
            categoriaPai: produto.categoriaPai ? produto.categoriaPai.nome : null,
            origem: produto.origem,

            classificacaoFiscal: produto.classificacaoFiscal ? {
                ncm: produto.classificacaoFiscal.ncm,
                caracteristica: produto.classificacaoFiscal.caracteristica,
                cestCodigo: produto.classificacaoFiscal.cestCoding,
                cestDescricao: produto.classificacaoFiscal.cestDescricao,
            } : null,

            imagemPrincipal: produto.imagemPrincipal ? {
                url: produto.imagemPrincipal.url,
                ultimaAtualizacao: produto.imagemPrincipal.ultimaAtualizacao,
            } : null,

            ativos: produto.ativos ? {
                url: produto.ativos.url,
                ultimaAtualizacao: produto.ativos.ultimaAtualizacao,
            } : null,

            composicaoLogistica: produto.composicaologistica ? {
                gtin: produto.composicaologistica.gtin,
                unidadeEmbalagem: produto.composicaologistica.unidadeEmbalagen,
                quantidade: produto.composicaologistica.quantidade,
                quantidadeTotal: produto.composicaoLogistica.quantidadeTotal,
                altura: produto.composicaologistica.altura,
                alturaUm: produto.composicaologistica.alturaum ? {
                    abrev: produto.composicaologistica.alturaum.abrev,
                    nome: produto.composicaologistica.alturalm.nome,
                    baseConversao: produto.composicaoLogistica.baseConvercao,
                largura: produto.largura,
                largauraUm: produto.larguraUm ? {
                    nome: produto.larguraUm.nome,
                    abrev: produto.larguraUm.abrev,
                    baseConversao: produto.larguraUm.baseConvercao,
                    } : null,
                } : null,

                profundidade: produto.profundidade,
                profundidadeUm: produto.profundidadeUm ? {
                    nome: produto.profundidadeUm.nome,
                    abrev: produto.profundidadeUmUm.abrev,
                    baseConversao: produto.profundidadeUm.baseConvercao,
                } : null,

                pesoLiquido: produto.pesoLiquido,
                pesoLiquidoUm: produto.pesoLiquidoUm ? {
                    nome: produto.pesoLiquidoUm.nome,
                    abrev: produto.pesoLiquidoUm.abrev,
                    baseConversao: produto.pesoLiquidoUm.baseConvercao,
                } : null,

                pseoBruto: produto.pseoBruto,
                pesoBrutoUm: produto.pesoBrutoUm ? {
                    nome: produto.pesoBrutoUm.nome,
                    abrev: produto.pesoBrutoUm.abrev,
                    baseConversao: produto.pesoBrutoUm.baseConvercao,
                } : null,

                quantidadeCamadasPallet: produto.quantidadeCamadasPallet !== undefined ? produto.quantidadeCamadasPallet : null,
                caixasCamada: produto.caixasCamada !== undefined ? produto.caixasCamada : null,
                alturaPallet: produto.alturaPallet !== undefined ? produto.alturaPallet : null,
                larguraPallet: produto.larguraPallet !== undefined ? produto.larguraPallet : null,
            } : null,
            
        }));
        
        
        return detalhes;
        
    } catch (error) {
        console.error('Erro ao buscar detalhes do produto:', error.message);
        throw error;
    }
}



module.exports = {
    autenticar,
    detalhesProduto,
    listarProdutos,
};
