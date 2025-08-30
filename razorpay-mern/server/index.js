import express from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// 🔹 Connect MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/payments", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// 🔹 Transaction Schema
const paymentSchema = new mongoose.Schema({
  orderId: String,
  paymentId: String,
  amount: Number,
  status: String,
  date: { type: Date, default: Date.now },
});
const Payment = mongoose.model("Payment", paymentSchema);

// 🔹 Razorpay Instance
const razorpay = new Razorpay({
  key_id: "rzp_test_RBbogjCKTOXOtg",
  key_secret: "itpS1rAVkcOcTW6oO6UINGfA",
});

// 1️⃣ Create Order
app.post("/create-order", async (req, res) => {
  const { amount } = req.body;
  const options = {
    amount: amount * 100,
    currency: "INR",
    receipt: "receipt_" + Date.now(),
  };
  const order = await razorpay.orders.create(options);
  res.json(order);
});

// 2️⃣ Verify Payment
app.post("/verify-payment", async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const sign = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSign = crypto
    .createHmac("sha256", "itpS1rAVkcOcTW6oO6UINGfA")
    .update(sign.toString())
    .digest("hex");

  if (razorpay_signature === expectedSign) {
    // ✅ Save Success
    const payment = new Payment({
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      amount: req.body.amount,
      status: "SUCCESS",
    });
    await payment.save();

    res.json({ success: true, message: "Payment Verified & Saved" });
  } else {
    // ❌ Save Fail
    const payment = new Payment({
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      amount: req.body.amount,
      status: "FAILED",
    });
    await payment.save();

    res.status(400).json({ success: false, message: "Invalid Signature" });
  }
});

app.listen(5000, () => console.log("🚀 Server running on http://localhost:5000"));
