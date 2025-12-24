const router = require('express').Router();
const { createUser, editUser } = require('./user.controller');
const auth = require('../../middlewares/auth.middleware');

router.post('/create', auth, createUser);
router.post('/edit/:id', auth, editUser);
router.get('/profile', auth, (req, res) => {
  res.status(200).json(req.user);
});

module.exports = router;
