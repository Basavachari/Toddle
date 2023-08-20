require('dotenv').config(); // Load environment variables from .env file
const { Client } = require('pg'); // Import the Client constructor from pg


const connectionString = process.env.CONNECTION_STRING;
const client = new Client({
  connectionString: connectionString
});

client.connect()
  .then(() => {
    console.log('Connected to the database');
  })
  .catch(err => {
    console.error('Error connecting to the database:', err);
  });


const query = async (text, params) => {
  try {
    const result = await client.query(text, params);
    return result;
  } catch (error) {
    throw error;
  }
};
  // Export the client instance
module.exports = {
    query,
    client
};