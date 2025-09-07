import React from 'react';
import axios from 'axios';
import Card from './components/Card';
import Navbar from './components/Navbar';
import { img, label } from 'framer-motion/client';

function Home() {
  // Sample product list
  const products = [
    { amount: 7999, img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", label: "Nike Sport Shoe" },
    { amount: 3000, img: "https://images.unsplash.com/photo-1667411424771-cadd97150827?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", label: "CyberBag" },
    { amount: 5899, img: "https://images.unsplash.com/photo-1608947325421-b13e6956c7b9?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", label: "Gym Stuff" },
    { amount: 5800, img: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", label: "Hand Bag" },
    { amount: 800, img: "https://images.unsplash.com/photo-1664286074240-d7059e004dff?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", label: "Leather Belt" },
    { amount: 1200, img: "https://images.unsplash.com/photo-1508296695146-257a814070b4?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", label: "Glasses" },
    {amount : 1200 , img: "https://images.unsplash.com/photo-1615602400380-3795d0b23777?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",label:"Hugo Boss Perfume"},
    {amount : 1200 , img: "https://images.unsplash.com/photo-1629121291243-7b5e885cce9b?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",label:"Hugo Boss Perfume"},
    { amount : 5111,img:"https://images.unsplash.com/photo-1632160871990-be30194885aa?q=80&w=765&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",label:"cyberpunk Mouse"},
    { amount : 5111,img:"https://images.unsplash.com/photo-1511300961358-669ca3ad05af?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",label:"Airbuds"}

   
  ];

  // Razorpay Checkout function
  const checkout = async (amount) => {
    try {
      const { data: { key } } = await axios.get("http://localhost:4000/api/getkey");
      const { data: { order } } = await axios.post("http://localhost:4000/api/checkout", { amount });

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
          name: "Sanket A",
          email: "test@example.com",
          contact: "9000090000"
        },
        notes: { address: "Razorpay Corporate Office" },
        theme: { color: "#3399cc" }
      };

      const razor = new window.Razorpay(options);
      razor.open();

    } catch (error) {
      console.error("Checkout error:", error);
    }
  }

  return (
    <div className=" bg-gray-100">
      <Navbar />

      <div className="pt-24 px-6 max-w-7xl mx-auto">
        {/* <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Products
        </h1> */}

        {/* Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {products.map((prod, idx) => (
            <Card
              key={idx}
              img={prod.img}
              amount={prod.amount}
              checkout={checkout}
              label={prod.label}  // Product name
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
