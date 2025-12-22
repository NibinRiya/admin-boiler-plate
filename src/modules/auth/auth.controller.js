const authService = require('./auth.service');

exports.register = async (req, res) => {
  const { user, token } = await authService.register(req.body);
  res.status(201).json({ token, user });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const { user, token } = await authService.login(email, password);
  res.status(200).json({ token, user });
};
