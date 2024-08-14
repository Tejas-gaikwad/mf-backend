// src/middleware/authMiddleware.js

const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];


  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  jwt.verify(token, 'mutual_fund_jwt_secret_key', (err, investor) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token'});
    }
    console.log("investor_uid -------   "+investor.investor_uid);
    if(investor.investor_uid){
      req.investor = investor;
      next();
    }else{
      return res.status(403).json({ message: 'Please provide valid token.' });
    }
  });
};

module.exports = {
  authenticateToken
};
