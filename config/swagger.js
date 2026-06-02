const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const path = require('path');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Ecommerce API',
            version: '1.0.0',
            description: 'API documentation for the Ecommerce Backend',
        },
        servers: [
            {
                url: '/api',
                description: 'Servidor Actual (Ruta Relativa)'
            },
            {
                url: 'http://localhost:3000/api',
                description: 'Servidor Local'
            },
            {
                url: 'https://organizacion-bakend-3yl9vj-87dc47-187-77-195-31.sslip.io/api',
                description: 'Servidor Desplegado'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: [path.join(__dirname, '../routes/*.js')], // Use absolute path
};

const specs = swaggerJsdoc(options);

module.exports = { swaggerUi, specs };
