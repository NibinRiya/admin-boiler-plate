// const User = require('./user.model');
const userService = require('./user.service');

exports.createUser = async (req, res) => {
  const user = await userService.createUser(req.body);
  res.status(201).json(user);
};
exports.editUser = async (req, res, next) => {
  try {
  const userId = req.params.id;
  const updateData = req.body;
  const user = await userService.editUser(userId, updateData);
  res.status(200).json(user);
  } catch (error) {
      next(error);
  }
}