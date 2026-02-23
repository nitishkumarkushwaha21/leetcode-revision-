const mongoose = require('mongoose');

const connect = async (uri) => {
  try {
    await mongoose.connect(uri);
    console.log('Mongoose connected to MongoDB');
  } catch (err) {
    console.error('Mongoose connection error:', err.message);
    throw err;
  }
};

module.exports = { connect };
