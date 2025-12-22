const router = require('express').Router();
const { createUser } = require('./user.controller');
const auth = require('../../middlewares/auth.middleware');

router.post('/create', auth, createUser);

router.get('/profile', auth, (req, res) => {
  res.json(req.user);
});

module.exports = router;
