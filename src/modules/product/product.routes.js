const router = require('express').Router();
const { getProducts, createProduct, editProduct, deleteProduct } = require('./product.controller');
const auth = require('../../middlewares/auth.middleware');

router.get('/', auth, getProducts);
router.post('/create', auth, createProduct);
router.post('/edit/:id', auth, editProduct);
router.delete('/delete/:id', auth, deleteProduct);

module.exports = router;