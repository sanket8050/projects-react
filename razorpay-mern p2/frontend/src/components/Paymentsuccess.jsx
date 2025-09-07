import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";


function Confetti() {
  return (
    <div className="pointer-events-none fixed inset-0 z-50 flex justify-center items-start">
      <div className="animate-bounce">
        {/* <span className="text-5xl">🎊</span> */}
      </div>
    </div>
  );
}

function Paymentsuccess() {
  const location = useLocation();
  const query = new URLSearchParams(location.search);

  const paymentId = query.get("reference");
  const amount = query.get("amount");
  const label = query.get("label");
  const img = query.get("img");
  const method = query.get("method") || "Card/Netbanking";

  useEffect(() => {}, []);

  return ( 
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-100 to-blue-100 p-6 relative">
 
      <Confetti /> 

    
      <div className="mb-8 animate-bounce">
        <svg className="w-20 h-20 text-green-600 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="white" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2l4-4" />
        </svg>
        <h1 className="text-4xl font-bold text-green-700 mt-4">Payment Successful!</h1>
        <p className="text-gray-700 mt-2">Thank you for your purchase 🎉</p>
      </div>

      {/* Payment Details Card */}
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md text-center mb-10">
        <h2 className="text-2xl font-bold text-indigo-700 mb-4">{label || "Product"}</h2>
        {img && (
          <img src={img} alt={label} className="h-32 w-32 object-cover rounded-lg mx-auto mb-4 shadow-md" />
        )}
        <div className="flex flex-col gap-2 items-center">
          <div className="text-lg text-gray-700">
            <span className="font-semibold">Payment ID:</span>
            <span className="font-mono text-indigo-600 ml-2">{paymentId}</span>
          </div>
          <div className="text-lg text-gray-700">
            <span className="font-semibold">Amount Paid:</span>
            <span className="text-green-700 font-bold ml-2">₹{amount}</span>
          </div>
          <div className="text-lg text-gray-700">
            <span className="font-semibold">Payment Method:</span>
            <span className="text-blue-700 font-bold ml-2">{method}</span>
          </div>
        </div>
      </div>

      {/* Share Button */}
      <div className="mt-4 text-center">
        <button className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-lg shadow-lg font-bold text-lg transition duration-300 ease-in-out transform hover:scale-105 animate-fade-in">
          Share on Social Media
        </button>
      </div>
    </div>
  );
}

export default Paymentsuccess;



// import React from "react";
// import { useLocation } from "react-router-dom";

// function Paymentsuccess() {
//   const location = useLocation();
//   const query = new URLSearchParams(location.search);
//   const amount = query.get("amount");

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-100 to-blue-100 p-6">
//       <div className="bg-red shadow-2xl rounded-2xl p-8 w-full max-w-md text-center">
//         <h2 className="text-2xl font-bold text-indigo-700 mb-4">Amount Paid</h2>
//         <div className="text-green-700 font-bold text-3xl">₹{amount}</div>
//       </div>
//     </div>
//   );
// }

// export default Paymentsuccess;