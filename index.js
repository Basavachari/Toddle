require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const bodyParser = require('body-parser');

// const swaggerUi = require('swagger-ui-express');
// const specs = require('./swagger');

const auth = require('./Controllers/auth');
const journal = require('./Controllers/journal');
const authenticate = require('./middleware/authenticateToken');


const db = require('./db/dbConnection'); 
const JWT_SECRET =  process.env.JWT_SECRET; 

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

app.use((req, res, next) => {
  req.db = db.client; 
  next();
});

app.use((req, res, next) => {
  req.JWT_SECRET = JWT_SECRET; 
  next();
});

// Use the routes
app.use('/api/user', auth);

app.use('/api/user/journal',authenticate,journal)

// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs))

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});




