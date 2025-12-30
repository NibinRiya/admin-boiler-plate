const userModel = require("./user.model");
const mongoose = require('mongoose');

exports.getUsers = async () => {
    const users = await userModel.find();
    return users;
}
exports.createUser = async (userData) => {
    if (!userData || Object.keys(userData).length === 0) {
        throw new Error("User data is required");
    }
  const user = await userModel.create(userData);
  return user;
};
exports.editUser = async (userId, updateData) => {
  // 1️⃣ Validate userId presence
  if (!userId) {
    throw new Error('User ID is required');
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    const error = new Error('Invalid user ID format');
    error.statusCode = 400;
    throw error;
  }

  if (!updateData || Object.keys(updateData).length === 0) {
    const error = new Error('Update data is required');
    error.statusCode = 400;
    throw error;
  }

  const existingUser = await userModel.findById(userId);
  if (!existingUser) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  const updatedUser = await userModel.findByIdAndUpdate(
    userId,
    updateData,
    {
      new: true,
      runValidators: true,
    }
  );

  return updatedUser;
};
exports.deleteUser = async (userId) => {
    // 1️⃣ Validate userId presence
    if (!userId) {
      throw new Error('User ID is required');
    }
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      const error = new Error('Invalid user ID format');
      error.statusCode = 400;
      throw error;
    }

    const user = await userModel.findByIdAndDelete(userId);
    return user;
  };