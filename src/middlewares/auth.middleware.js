const jwt = require('jsonwebtoken');
const User = require('../modules/user/user.model');
const mongoose = require('mongoose');

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer'))
      return res.status(401).json({ message: 'Unauthorized' });

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    
    if (!mongoose.Types.ObjectId.isValid(decoded.id)) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;

    next();
  } catch {
    res.status(401).json({ message: 'Token expired or invalid' });
  }
};
