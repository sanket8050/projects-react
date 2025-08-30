import { useState } from "react";
import axios from "axios";

function App() {
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState(null);

  const handlePayment = async () => {
    try {
      // 1. Create order
      const { data: order } = await axios.post("http://localhost:5000/create-order", { amount });

      // 2. Razorpay checkout
      const options = {
        key: "rzp_test_RBbogjCKTOXOtg",
        amount: order.amount,
        currency: order.currency,
        order_id: order.id,
        name: "My App Payments",
        description: "Secure Transaction",
        handler: async function (response) {
          try {
            // 3. Verify payment with backend
            const verifyRes = await axios.post("http://localhost:5000/verify-payment", response);
            setStatus({
              success: true,
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              message: verifyRes.data.message,
            });
          } catch (error) {
            setStatus({
              success: false,
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              message: "Verification Failed",
            });
          }
        },
        theme: { color: "#1a73e8" },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response) {
        setStatus({
          success: false,
          paymentId: response.error.metadata.payment_id,
          orderId: response.error.metadata.order_id,
          message: response.error.description,
        });
      });
      rzp.open();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto text-center">
      <h2 className="text-2xl font-bold mb-4">💳 Pay with Razorpay</h2>

      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Enter amount"
        className="border p-2 rounded w-full mb-4"
      />

      <button
        onClick={handlePayment}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Pay Now
      </button>

      {status && (
        <div
          className={`mt-6 p-4 rounded-lg shadow ${
            status.success ? "bg-green-100" : "bg-red-100"
          }`}
        >
          <h3 className="text-lg font-semibold">
            {status.success ? "✅ Payment Successful" : "❌ Payment Failed"}
          </h3>
          <p>Order ID: {status.orderId}</p>
          <p>Payment ID: {status.paymentId}</p>
          <p>{status.message}</p>
        </div>
      )}
    </div>
  );
}

export default App;
