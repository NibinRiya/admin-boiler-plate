const router = require('express').Router();
const { getUsers, createUser, editUser, deleteUser } = require('./user.controller');
const auth = require('../../middlewares/auth.middleware');

router.get('/', auth, getUsers);
router.post('/create', auth, createUser);
router.post('/edit/:id', auth, editUser);
router.delete('/delete/:id', auth, deleteUser);
router.get('/profile', auth, (req, res) => {
  res.status(200).json(req.user);
});

module.exports = router;
