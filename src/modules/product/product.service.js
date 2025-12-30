const productModel = require('./product.model');
const mongoose = require('mongoose');

exports.getProducts = async () => {
  return await productModel.find();
};

exports.createProduct = async (productData) => {
    if (!productData || Object.keys(productData).length === 0) {
        throw new Error("Product data is required");
    }
  const product = new productModel(productData);
  return await product.save();
};

exports.editProduct = async (productId, updateData) => {
    if (!productId) {
        throw new Error('Product ID is required');
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
        const error = new Error('Invalid product ID format');
        error.statusCode = 400;
        throw error;
    }

    if (!updateData || Object.keys(updateData).length === 0) {
        const error = new Error('Update data is required');
        error.statusCode = 400;
        throw error;
    }   
    const existingProduct = await productModel.findById(productId);
    if (!existingProduct) {
        const error = new Error('Product not found');
        error.statusCode = 404;
        throw error;
    }

  return await productModel.findByIdAndUpdate(productId, updateData, { new: true, runValidators: true });
};

exports.deleteProduct = async (productId) => {
    if (!productId) {
        throw new Error('Product ID is required');
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {      
        const error = new Error('Invalid product ID format');
        error.statusCode = 400;
        throw error;
    }
  return await productModel.findByIdAndDelete(productId);
};