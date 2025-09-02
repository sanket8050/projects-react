import React from 'react'
import axios from 'axios'
import Card from './components/Card'; // make sure you have this Card component

function Home() {
  
  const checkout = async (amount) => {
    try {
      // Get API key
      const { data: { key } } = await axios.get("http://localhost:4000/api/getkey");

      // Create order
      const { data: { order } } = await axios.post("http://localhost:4000/api/checkout", { amount });

      // Razorpay options
      const options = {
        key, 
        amount: order.amount,
        currency: "INR",
        name: "Sanket8050",
        description: "Test Transaction",
        image: "https://avatars.githubusercontent.com/u/148283244?v=4&size=64",
        order_id: order.id,
        callback_url: "http://localhost:4000/api/paymentVerification",
        prefill: {
          name: "Gaurav Kumar",
          email: "gaurav.kumar@example.com",
          contact: "9000090000"
        },
        notes: {
          address: "Razorpay Corporate Office"
        },
        theme: {
          color: "#3399cc"
        }
      };

      // Open Razorpay modal
      const razor = new window.Razorpay(options);
      razor.open();

    } catch (error) {
      console.error("Checkout error:", error);
    }
  }

  return (
    <div className="flex flex-col md:flex-row gap-6 items-center justify-center min-h-screen">
      <Card 
        amount={5000} 
        img="https://cdn.pixabay.com/objects3d/2025/08/11/09-16-28-881/render_720_720_0_340_0.png" 
        checkout={checkout} 
      />
      <Card 
        amount={3000} 
        img="https://cdn.pixabay.com/photo/2017/04/03/15/52/mobile-phone-2198770_1280.png" 
        checkout={checkout} 
      />
      <Card 
        amount={500} 
        img="https://cdn.pixabay.com/photo/2025/08/26/16/58/guy-9798371_1280.png" 
        checkout={checkout} 
      />
    </div>
  )
}

export default Home
