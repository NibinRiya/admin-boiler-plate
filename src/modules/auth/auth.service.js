const bcrypt = require('bcryptjs');
const User = require('../user/user.model');
const {
  generateAccessToken,
  generateRefreshToken,
} = require('../../utils/jwt');

exports.register = async (data) => {
  console.log("REGISTER DATA:", data);
  const payload = data.user || data;

  const user = await User.create(payload);
    console.log("PAYLOAD USED:", payload);

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
