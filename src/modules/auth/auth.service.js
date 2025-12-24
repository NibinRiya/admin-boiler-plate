const bcrypt = require('bcryptjs');
const User = require('../user/user.model');
const {
  generateAccessToken,
  generateRefreshToken,
} = require('../../utils/jwt');

exports.register = async (data) => {
  const user = await User.create(data);

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  user.refreshToken = refreshToken;
  await user.save();

  return { user, accessToken, refreshToken };
};

exports.login = async (email, password) => {
  const user = await User.findOne({ email }).select('+password +refreshToken');
  if (!user) throw new Error('Invalid credentials');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error('Invalid credentials');

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  user.refreshToken = refreshToken;
  await user.save();

  return { user, accessToken, refreshToken };
};
