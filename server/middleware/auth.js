const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token manquant' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.userId }; // Changé de decoded.id à decoded.userId
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Token invalide' });
  }
};

module.exports = { authenticateToken };