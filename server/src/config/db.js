import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const mongoURI =
      process.env.MONGODB_URI ||
      process.env.MONGO_URI ||
      "mongodb://localhost:27017/rewear";

    await mongoose.connect(mongoURI, {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });
    console.log("MongoDB Connected!");
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.log(
      "Please check your MongoDB connection string and ensure MongoDB is running."
    );
    process.exit(1);
  }
};

export default connectDB;
