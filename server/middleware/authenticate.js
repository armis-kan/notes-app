const jwt = require('jsonwebtoken');
const { getUserByUsername } = require('../db');

const authenticateUser = async (req, res, next) => {
  // Check for token in headers
  const token = req.header('Authorization')?.replace('Bearer ', '');
  console.log(req.header('Authorization'));
  console.log('token: ' + token);
  if (!token) {
    return res.status(401).json({ error: 'Authorization token not found' });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await getUserByUsername(decoded.user.username);

    if (!user) {
      throw new Error();
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

module.exports = authenticateUser;
