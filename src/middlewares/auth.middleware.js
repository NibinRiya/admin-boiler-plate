const jwt = require('jsonwebtoken');
const User = require('../modules/user/user.model');

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer'))
      return res.status(401).json({ message: 'Unauthorized' });

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.user = await User.findById(decoded.id);

    next();
  } catch {
    res.status(401).json({ message: 'Token expired or invalid' });
  }
};
