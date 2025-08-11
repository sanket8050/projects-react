import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white px-4">
      
      {/* Big 404 Text */}
      <h1 className="text-[8rem] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-yellow-400 animate-pulse">
        404
      </h1>

      {/* Message */}
      <p className="text-2xl md:text-3xl font-light mb-6 text-gray-300">
        Oops! The page you're looking for doesn't exist.
      </p>

      {/* Button */}
      <Link
        to="/"
        className="px-6 py-3 bg-red-500 hover:bg-red-600 rounded-lg text-lg font-semibold shadow-lg transition duration-300"
      >
        Go Back Home
      </Link>

      {/* Decorative Glow */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-yellow-400" />
    </div>
  );
}

export default NotFound;
