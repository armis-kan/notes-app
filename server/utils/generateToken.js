const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  const token = jwt.sign({ user }, process.env.JWT_SECRET, { expiresIn: '1h' });
  return token;
};

module.exports = generateToken;
