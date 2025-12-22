const mongoose = require('mongoose');

exports.connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

exports.disconnectDB = async () => {
  await mongoose.disconnect();
  console.log('MongoDB disconnected');
};