import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    console.log("MongoDB successfully connected");
  } catch (err) {
    console.error("you failed, MongoDB is not connected, looser :", err);
    process.exit(1);
  }
};

export default connectDB;
