import { app }  from "./app.js";
import Razorpay from "razorpay"
import mongoose from "mongoose";
export const instance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});
const start = async () => {
  try {
    if (process.env.MONGODB_URI) {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log("MongoDB connected");
    } else {
      console.log("MONGODB_URI not set, skipping DB connection");
    }
  } catch (err) {
    console.error("MongoDB connection error", err);
    // Proceed without DB if desired; rethrow to exit if mandatory
  }

  app.listen(process.env.PORT, () =>
    console.log(`server is working on ${process.env.PORT}`)
  );
};

start();


