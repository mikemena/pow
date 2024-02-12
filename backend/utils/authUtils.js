const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  if (!process.env.ACCESS_TOKEN_SECRET) {
    console.warn('ACCESS_TOKEN_SECRET is not defined.');
    return res.status(500).json({ message: 'Internal server error' });
  }
  // console.log(process.env.ACCESS_TOKEN_SECRET);

  const authHeader = req.headers['authorization'];
  // console.log('authHeader', authHeader);
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

module.exports = {
  authenticateToken
};
