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
        console.log('Login efetuado com sucesso!')

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

        // console.log(response.data);

        // Extrair os detalhes relevantes do produto da resposta
        const detalhes = response.data.produtos.map(produto => ( 
            {
            "gtin": produto.gtin,
            "descricao": produto.descricao,
            "marca": produto.marca ? ({"nome": produto.marca.nome}) : (null),
            "submarca": produto.submarca ? ({"nome": produto.submarca.nome}) : (null),
            "codigoInterno": produto.codigoInterno,
            "categoriaProduto": produto.categoriaProduto ? ({"nome": produto.categoriaProduto.nome}) : (null),
            "categoriaPai": produto.categoriaPai ? ({"nome": produto.categoriaPai.nome}) : (null),
            "origem": produto.origem,

            "classificacaoFiscal": produto.classificacaoFiscal ? ({
                "ncm": produto.classificacaoFiscal.ncm,
                "caracteristica": produto.classificacaoFiscal.caracteristica ? produto.classificacaoFiscal.caracteristica : null,
                "cestCodigo": produto.classificacaoFiscal.cestCoding,
                "cestDescricao": produto.classificacaoFiscal.cestDescricao,
            }) : (null),

            "imagemPrincipal": produto.imagemPrincipal ? ({
                "url": produto.imagemPrincipal.url,
                "ultimaAtualizacao": produto.imagemPrincipal.ultimaAtualizacao,
            }) : (null),

            "ativos": produto.ativos ? produto.ativos.map( ativo => ({
                "url": ativo.url,
                "ultimaAtualizacao": ativo.ultimaAtualizacao,
            })) : (null),

            "composicoesLogisticas": produto.composicoesLogisticas ? produto.composicoesLogisticas.map( composicao => ({
                "niveis": composicao.niveis ? composicao.niveis.map( nivel => ({
                    "gtin": nivel.gtin,
                    "unidadeEmbalagem": nivel.unidadeEmbalagen,
                    "quantidade": nivel.quantidade,
                    "quantidadeTotal": nivel.quantidadeTotal,
                    "altura": nivel.altura,
                    "alturaUm": nivel.alturaUm ? ({
                        "nome": nivel.alturaUm.nome,
                        "abrev": nivel.alturaUm.abrev,
                        "baseConvercao": nivel.alturaUm.baseConvercao}) : null,
                    "largura": nivel.largura,
                    "largauraUm": nivel.larguraUm ? ({
                        "nome": nivel.larguraUm.nome,
                        "abrev": nivel.larguraUm.abrev,
                        "baseConvercao": nivel.larguraUm.baseConvercao}) : null,
                    "profundidade": nivel.profundidade,
                    "profundidadeUm": nivel.profundidadeUm ? ({
                        "nome": nivel.profundidadeUm.nome,
                        "abrev": nivel.profundidadeUm.abrev,
                        "baseConvercao": nivel.profundidadeUm.baseConvercao}) : null,
                    "pesoLiquido": nivel.pesoLiquido,
                    "pesoLiquidoUm": nivel.pesoLiquidoUm ? ({
                        "nome": nivel.pesoLiquidoUm.nome,
                        "abrev": nivel.pesoLiquidoUm.abrev,
                        "baseConvercao": nivel.pesoLiquidoUm.baseConvercao}) : null,
                    "pesoBruto": nivel.pesoBruto,
                    "pesoBrutoUm": nivel.pesoBrutoUm ? ({
                        "nome": nivel.pesoBrutoUm.nome,
                        "abrev": nivel.pesoBrutoUm.abrev,
                        "baseConvercao": nivel.pesoBrutoUm.baseConvercao}) : null,
                    "paletizacoes": nivel.paletizacoes ? nivel.paletizacoes.map( paletizacao => ({
                        "quantidadeCamadasPallet": paletizacao.quantidadeCamadasPallet,
                        "caixasCamada": paletizacao.caixasCamada,
                        "alturaPallet": paletizacao.alturaPallet,
                        "larguraPallet": paletizacao.larguraPallet})) : null
                })) : null
                })) : (null),
            }))
        
        return detalhes[0];
        
    } catch (error) {
        console.error('Erro ao buscar detalhes do produto: ', gtin, error.message);
        throw error;
        
    }
}


module.exports = {
    autenticar,
    detalhesProduto,
    listarProdutos,
};