const bcrypt = require('bcryptjs');
const User = require('../user/user.model');
const { generateToken } = require('../../utils/jwt');

exports.register = async (data) => {
  const user = await User.create(data);
  const token = generateToken(user._id);

  return { user, token };
};

exports.login = async (email, password) => {
  const user = await User.findOne({ email }).select('+password');

  if (!user) throw new Error('Invalid credentials');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error('Invalid credentials');

  const token = generateToken(user._id);

  return { user, token };
};
