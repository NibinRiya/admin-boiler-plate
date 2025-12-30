const router = require('express').Router();

router.use('/users', require('../modules/user/user.routes'));
router.use('/products', require('../modules/product/product.routes'));
router.use('/auth', require('../modules/auth/auth.routes'));

module.exports = router;
