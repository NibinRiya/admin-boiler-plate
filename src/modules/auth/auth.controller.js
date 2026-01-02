const authService = require('./auth.service');
const jwt = require('jsonwebtoken');
const User = require('../user/user.model');
const { generateAccessToken } = require('../../utils/jwt');

exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken)
      return res.status(401).json({ message: 'Refresh token missing' });

    const user = await User.findOne({ refreshToken });
    if (!user)
      return res.status(403).json({ message: 'Invalid refresh token' });

    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    const accessToken = generateAccessToken(user._id);

    res.json({ accessToken });
  } catch (err) {
    res.status(403).json({ message: 'Invalid refresh token' });
  }
};

exports.register = async (req, res) => {
  try {
    const { user, accessToken, refreshToken } =
      await authService.register(req.body);

    res.status(201).json({
      accessToken,
      refreshToken,
      user,
    });
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const { user, accessToken, refreshToken } =
      await authService.login(email, password);

    res.status(200).json({
      accessToken,
      refreshToken,
      user,
    });
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};

exports.logout = async (req, res) => {
  try {
  const { refreshToken } = req.body;

  await User.findOneAndUpdate(
    { refreshToken },
    { refreshToken: null }
  );
  return res.status(200).json({ message: 'Logged out successfully' });
  } catch (err) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};
