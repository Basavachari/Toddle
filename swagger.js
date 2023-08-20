// swagger.js
const swaggerJsDoc = require('swagger-jsdoc');



const options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Your API',
        version: '1.0.0',
        description: 'Your API description',
      },
      servers: [
        {
          url: 'https://toddle-backend-52ya.onrender.com', // Change this to your server URL
          description: 'Development server',
        },
        // You can add more server URLs for different environments
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
      security: [{ bearerAuth: [] }],
    },
    apis: ['index.js'],
    
  };

const specs = swaggerJsDoc(options);

module.exports = specs;
