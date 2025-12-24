const userModel = require("./user.model");

exports.createUser = async (userData) => {
    if (!userData) {
        throw new Error("User data is required");
    }
  const user = await userModel.create(userData);
  return user;
};
exports.editUser = async (userId, updateData) => {
    if (!userId) {
        throw new Error("User ID is required");
    }
    if (!updateData) {
        throw new Error("Update data is required");
    }
    const user = await userModel.findByIdAndUpdate(userId, updateData, { new: true });
    return user;
};