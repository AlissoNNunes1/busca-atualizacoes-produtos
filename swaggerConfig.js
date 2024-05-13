const swaggerJsdoc = require('swagger-jsdoc');

// Define as opções de configuração para o Swagger
const swaggerOptions = {
    // Informações básicas sobre a API
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'API de Produtos',
            description: 'API para listar e detalhar produtos atualizados',
            version: '1.0.0',
            contact: {
                name: 'Seu Nome',
                email: 'seuemail@example.com'
            }
        },
        servers: [
            {
                url: 'http://localhost:3000', // Substitua pelo URL do seu servidor em produção
                description: 'Servidor local'
            }
        ],
        paths: {
                '/': {
                        get: {
                        summary: 'Lista os produtos atualizados no dia',
                        responses: {
                                200: {
                                description: 'Produtos atualizados',
                                }
                                
                        }
                }
        }
    },
    components: {
        securitySchemes: {
                bearerAuth: {
                        type: 'http',
                        scheme: 'bearer',
                        bearerFormat: 'JWT'
                }
        },
        security: [
                {
                        bearerAuth: []
                }
        ]
    }
},

    // Define o local onde os endpoints estão definidos
    apis: ['./app.js'],
};

// Gera a documentação do Swagger com base nas opções fornecidas
const specs = swaggerJsdoc(swaggerOptions);

// Exporta a configuração do Swagger
module.exports = specs;
