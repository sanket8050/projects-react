import React from 'react';
import { ShoppingCart } from 'lucide-react';

function Card({ img, amount, checkout, label }) {
  return (
    <div className="relative bg-white rounded-xl border border-gray-200 shadow-lg p-5 flex flex-col items-center w-56 transform transition duration-300 hover:scale-105 hover:shadow-2xl">

      {/* Product Name */}
      {label && (
        <h2 className="text-lg sm:text-xl md:text-xl font-bold text-gray-900 mb-3 text-center tracking-tight">
          {label}
        </h2>
      )}

      {/* Product Image */}
      <img
        className="h-40 w-40 object-cover rounded-lg mb-4 shadow-sm transition duration-200 hover:scale-105"
        src={img}
        alt={label || "product"}
      />

      {/* Amount */}
      <p className="text-xl font-semibold text-gray-800 mb-4">
        ₹{amount}
      </p>

      {/* Buy Button */}
      <button
        onClick={() => checkout(amount)}
        className="flex items-center justify-center gap-2 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-lg shadow-md transition duration-200 hover:scale-105"
      >
        <ShoppingCart className="w-5 h-5" />
        Buy Now
      </button>
    </div>
  );
}

export default Card;
