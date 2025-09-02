import { instance } from "../index.js";
import { Payment } from "../model/Payment.js";
import crypto from "crypto"
export const checkout = async (req,res)=>{



    const options = {
        amount: Number(req.body.amount * 100 ),  // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        currency: "INR",
          
    };
    const order = await instance.orders.create(options)

    console.log(order);
    res.status(200).json({
        success : true,
        order,
    });
}; 

export const paymentVerification = async (req,res)=>{
    
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest("hex");

  const isAuthentic = expectedSignature === razorpay_signature;

  if (isAuthentic) {
    // Database comes here

    try {
      if (Payment) {
        await Payment.create({
          razorpay_order_id,
          razorpay_payment_id,
          razorpay_signature,
        });
      }
    } catch (e) {
      console.error("Failed to persist payment:", e);
      // Continue to redirect even if DB write fails, similar to tutorial UX
    }

    res.redirect(
      `http://localhost:5173/paymentsuccess?reference=${razorpay_payment_id}`
    );
  } else {
    res.status(400).json({
      success: false,
    });
        
  }
};  