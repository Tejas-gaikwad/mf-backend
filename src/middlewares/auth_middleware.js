// src/middleware/authMiddleware.js

const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];


  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  jwt.verify(token, 'mutual_fund_jwt_secret_key', (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token'});
    }
    console.log("username -------   "+user.username);
    if(user.username){
      req.user = user;
      next();
    }else{
      return res.status(403).json({ message: 'Please provide valid token.' });
    }
  });
};

module.exports = {
  authenticateToken
};
