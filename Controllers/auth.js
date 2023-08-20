const express = require('express');
const jwt = require('jsonwebtoken'); 
const router = express.Router();
// const db = require('../db/queries'); // Import your query functions

const JWT_SECRET = process.env.JWT_SECRET;
const queries = require('../db/queries');

router.post('/register', async (req, res) => {
  try {
    const { username, password,role } = req.body;

    const newUser = await queries.createUser(username, password,role);
    
    console.log(newUser)
    
    const token = jwt.sign({ userId: newUser.id }, JWT_SECRET);
    res.status(201).json({ user: newUser, token });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'An error occurred' });
  }
});

router.post('/login', async (req, res) => {
    try {
      const { username, password } = req.body;
  
      // Check if the user exists and verify the password (replace with actual logic)
      const user = await queries.getUserByUsername(username);
      if (!user || !(password == user.password)) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      // Generate a JWT token
      const token = jwt.sign({ userId: user.id }, JWT_SECRET);
  
      res.json({ token });
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ message: 'Login failed. Please try again later.' });
    }
  });

module.exports = router;
