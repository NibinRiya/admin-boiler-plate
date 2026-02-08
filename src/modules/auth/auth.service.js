const bcrypt = require('bcryptjs');
const User = require('../user/user.model');
const {
  generateAccessToken,
  generateRefreshToken,
} = require('../../utils/jwt');

exports.register = async (data) => {
  const existingUser = await User.findOne({ email: data.email });
  if (existingUser) {
    const error = new Error('Email already in use');
    error.statusCode = 400;
    throw error;
  }
  const payload = data.user || data;
  const user = await User.create(payload);
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);
  user.refreshToken = refreshToken;
  await user.save();

  return { user, accessToken, refreshToken };
};

exports.login = async (email, password) => {
  const user = await User.findOne({ email }).select('+password +refreshToken');
  if (!user) {
    const error = new Error('Invalid credentials');
    error.statusCode = 401;
    throw error;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const error = new Error('Invalid credentials');
    error.statusCode = 401;
    throw error;
  }

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  user.refreshToken = refreshToken;
  await user.save();

  return { user, accessToken, refreshToken };
};
