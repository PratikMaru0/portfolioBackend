import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const connectDB = async () => {
  await mongoose.connect(process.env.URI);
};

export default connectDB;
