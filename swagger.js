// swagger.js
const swaggerJsDoc = require('swagger-jsdoc');

// const options = {
//   definition: {
//     openapi: '3.0.0',
//     info: {
//       title: 'Your API Documentation',
//       version: '1.0.0',
//     },
//     servers:[
//         {
//             url :"http://localhost:3000/"
//         }
//     ]
    
//   },
  
//   apis: ['index.js'], // Replace with your actual path to route files
// };


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
          url: 'http://localhost:3000', // Change this to your server URL
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
