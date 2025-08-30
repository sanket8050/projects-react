import { useState } from "react";
import axios from "axios";

function App() {
  const [amount, setAmount] = useState("");

  const handlePayment = async () => {
    try {
      // Step 1: Ask backend to create order
      const { data: order } = await axios.post("http://localhost:5000/create-order", {
        amount,
      });

      // Step 2: Open Razorpay Checkout
      const options = {
        key: "rzp_test_RBbogjCKTOXOtg", // Use your actual test key from .env
        amount: order.amount,
        currency: order.currency,
        order_id: order.id,
        name: "Test Payment",
        description: "Pay securely",
        handler: function (response) {
          alert("Payment Successful! Payment ID: " + response.razorpay_payment_id);
        },
        theme: { color: "#3399cc" },
        modal: {
          ondismiss: function () {
            alert("Oops! Something went wrong. Payment Failed");
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response){
        alert("Oops! Something went wrong. Payment Failed\n" + response.error.description);
      });
      rzp.open();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Pay with Razorpay</h2>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Enter amount"
      />
      <button onClick={handlePayment}>Pay Now</button>
    </div>
  );
}

export default App;
