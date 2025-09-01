import React from 'react';

function Card({ img, amount, checkout }) {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center w-48 ">
      <img className="h-32 w-32 object-cover rounded-md" src={img} alt="product" />
      <p className="mt-2 text-lg font-semibold text-gray-800 text-center">
        ₹{amount}
      </p>
      <button
        onClick={()=>{checkout(amount)}}
        className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
      >
        Buy now
      </button>
    </div>
  );
}

export default Card;
