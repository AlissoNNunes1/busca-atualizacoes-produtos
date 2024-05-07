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
        const detalhes = response.data.map(produto => {
            {
            "gtin": produto.gtin,
            "descricao": produto.descricao,
            "marca": produto.marca ? produto.marca.nome : null,
            "submarca": produto.submarca ? {{produto.submarca.nome}} : null,
            "codigoInterno": produto.codigoInterno,
            "categoriaProduto": produto.categoriaProduto ? {{produto.categoriaProduto.nome}} : null,
            "categoriaPai": produto.categoriaPai ? {{produto.categoriaPai.nome}} : null,
            "origem": produto.origem,

            "classificacaoFiscal": produto.classificacaoFiscal ? {
                "ncm": produto.classificacaoFiscal.ncm,
                "caracteristica": produto.classificacaoFiscal.caracteristica ? produto.classificacaoFiscal.caracteristica : null,
                "cestCodigo": produto.classificacaoFiscal.cestCoding,
                "cestDescricao": produto.classificacaoFiscal.cestDescricao,
            } : null,

            "imagemPrincipal": produto.imagemPrincipal ? {
                "url": produto.imagemPrincipal.url,
                "ultimaAtualizacao": produto.imagemPrincipal.ultimaAtualizacao,
            } : null,

            "ativos": produto.ativos ? produtos.ativos.map( ativo => {
                "url": ativo.url,
                "ultimaAtualizacao": ativo.ultimaAtualizacao,
            }) : null,

            "composicoesLogisticas": produto.composicoesLogisticas ? produto.composicoesLogisticas.map( composicao => {
                "niveis": composicao.niveis ? composicao.niveis.map( nivel => {
                    "gtin": nivel.gtin,
                    "unidadeEmbalagem": nivel.unidadeEmbalagen,
                    "quantidade": nivel.quantidade,
                    "quantidadeTotal": nivel.quantidadeTotal,
                    "altura": nivel.altura,
                    "alturaUm": nivel.alturaUm ? nivel.alturaUm.map(altura => {
                        "nome": altura.nome,
                        "abrev": altura.abrev,
                        "baseConvercao": altura.baseConvercao}) : null,
                    "largura": nivel.largura,
                    "largauraUm": nivel.larguraUm ? nivel.larguraUm.map(largura => {
                        "nome": largura.nome,
                        "abrev": largura.abrev,
                        "baseConvercao": largura.baseConvercao}) : null,
                    "profundidade": nivel.profundidade,
                    "profundidadeUm": nivel.profundidadeUm ? nivel.profundidadeUm.map(profundidade => {
                        "nome": profundidade.nome,
                        "abrev": profundidade.abrev,
                        "baseConvercao": profundidade.baseConvercao}) : null,
                    "pesoLiquido": nivel.pesoLiquido,
                    "pesoLiquidoUm": nivel.pesoLiquidoUm ? nivel.profundidadeUm.map(pesoLiquido => {
                        "nome": pesoLiquido.nome,
                        "abrev": pesoLiquido.abrev,
                        "baseConvercao": pesoLiquido.baseConvercao}) : null,
                    "pesoBruto": nivel.pesoBruto,
                    "pesoBrutoUm": nivel.pesoBrutoUm ? nivel.pesoBrutoUm.map(pesoBruto => {
                        "nome": pesoBruto.nome,
                        "abrev": pesoBruto.abrev,
                        "baseConvercao": pesoBruto.baseConvercao}) : null,
                    "paletizacoes": nivel.paletizacoes ? nivel.paletizacoes.map( paletizacao => {
                        "quantidadeCamadasPallet": paletizacao.quantidadeCamadasPallet,
                        "caixasCamada": paletizacao.caixasCamada,
                        "alturaPallet": paletizacao.alturaPallet,
                        "larguraPallet": paletizacao.larguraPallet}) : null
                }) : null
                }) : null,
            }}
        
        
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
