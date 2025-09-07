import { log } from "console";
import { instance } from "../index.js";
import { Payment } from "../model/Payment.js";
import crypto from "crypto"
export const checkout = async (req,res)=>{



    const options = {
        amount: Number(req.body.amount * 100 ),  // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        currency: "INR",
        payment_capture: 1,
          
    };
    const order = await instance.orders.create(options)

  //  console.log(order);
   
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

    try {
      const paidOrder = await instance.orders.fetch(razorpay_order_id);
      console.log("Order after payment:", {
        id: paidOrder.id,
        status: paidOrder.status,
        amount: paidOrder.amount/100,
        amount_paid: paidOrder.amount_paid/100,
        attempts: paidOrder.attempts,
      });
    } catch (e) {
      console.error("Failed to fetch order after verification:", e?.message || e);
    }

    try {
      const payment = await instance.payments.fetch(razorpay_payment_id);
      console.log("Payment fetched:", {
        id: payment.id,
        status: payment.status,
        method: payment.method,
        captured: payment.captured,
        amount: payment.amount/100,
        order_id: payment.order_id,
      });
    } catch (e) {
      console.error("Failed to fetch payment after verification:", e?.message || e);
    }

    // Fetch product details from DB or request if available (for now, use placeholders)
    // You can extend this to fetch actual product info if you store it with the order
    // const amount = req.body.amount || "";
    // const label = req.body.label || "Product";
    // const img = req.body.img || "";
    // const method = req.body.method || "Card/Netbanking";

    res.redirect(
      `http://localhost:5173/paymentsuccess?reference=${razorpay_payment_id}`
       
      
    );
  } else {
    res.status(400).json({
      success: false,
    });
        
  }
};  