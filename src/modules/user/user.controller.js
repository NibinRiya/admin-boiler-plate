const User = require('./user.model');

exports.createUser = async (req, res) => {
  const user = await User.create(req.body);
  res.status(201).json(user);
};
