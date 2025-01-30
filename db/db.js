import mongoose from "mongoose";
export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI).then((res) => {
      console.log("connected to MongoDB");
    })
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};