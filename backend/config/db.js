import mongoose from "mongoose";
import dotenv   from "dotenv";
dotenv.config();

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected (no-crypto demo)");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};