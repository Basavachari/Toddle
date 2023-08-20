const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env; // Load JWT secret from environment variables

const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1]; // Get token from header
  if (!token) {
    return res.status(401).json({ message: 'Authorization token missing' });
  }

  try {
    const decodedToken = jwt.verify(token, JWT_SECRET);
    req.userId = decodedToken.userId; // Attach user ID to the request
    next();
  } catch (error) {
    res.status(403).json({ message: 'Invalid token' });
  }
};

module.exports = authenticateToken;
