const User = require('../modules/user/user.model');

/**
 * Admin role check middleware
 * Must be used AFTER auth middleware to have access to req.user
 */
module.exports = async (req, res, next) => {
  try {
    // req.user should already be set by auth middleware
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized: No user found' });
    }

    const user = await User.findById(req.user._id);
    
    if (!user || user === null) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: Admin access required' });
    }

    // User is admin, proceed
    next();
  } catch (error) {
    res.status(500).json({ message: 'Error checking admin privileges' });
  }
};
