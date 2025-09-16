import React, { useEffect, useState } from "react";
import Skeleton from "./components/Skeleton";

function App() {
  const [data, setdata] = useState({ products: [], total: 0, skip: 0, limit: 10 });
  const [loading, setloading] = useState(false);
  const [error, seterror] = useState(false);


  async function fetchdata(skip = 0, limit =  10) {
    try {
      setloading(true);
      const res = await fetch(`https://dummyjson.com/products?limit=${limit}&skip=${skip}`);
      const json = await res.json();
      setdata(json);
    } catch (error) {
      seterror(true);
    } finally {
      setloading(false);
    }
  }

  useEffect(() => {
    fetchdata(0, 10);
  }, []);

  const handlenext = () => {
    if (data.skip + data.limit < data.total)
      fetchdata(data.skip + data.limit, data.limit);
  };

  const handleprev = () => {
    if (data.skip - data.limit >= 0)
      fetchdata(data.skip - data.limit, data.limit);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 flex flex-col items-center py-12 px-4">
      
      {/* Heading */}
      <h1 className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-8 tracking-wide drop-shadow-md">
        Product Catalog
      </h1>

      {/* Loading Skeletons */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-6xl">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center max-w-md">
          <p className="text-red-700 text-lg font-semibold">⚠️ Something went wrong, please try again.</p>
        </div>
      ) : (
        <>
          {/* Products Grid */}
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 w-full max-w-7xl flex-1 content-start">
            {data.products.map((e) => (
              <li
                key={e.id}
                className="bg-gradient-to-br from-white to-gray-50 shadow-xl rounded-2xl p-6 flex flex-col items-start hover:scale-105 hover:shadow-2xl transition-all duration-300 border border-gray-100"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-white font-bold">📦</span>
                </div>
                <p className="text-gray-800 font-semibold text-lg">{e.title}</p>
              </li>
            ))}
          </ul>

          {/* Pagination Controls */}
          <div className="flex gap-6 mt-6">
            <button
              onClick={handleprev}
              disabled={data.skip === 0}
              className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              ◀ Prev
            </button>

            <button
              onClick={handlenext}
              disabled={data.skip + data.limit >= data.total}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              Next ▶
            </button>
          </div>

          {/* Footer */}
          <footer className="mt-4 text-gray-700 text-lg font-medium">
            Page <span className="font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">{data.skip / data.limit + 1}</span> of{" "}
            {Math.ceil(data.total / data.limit)}
          </footer>
        </>
      )}
    </div>
  );
}

export default App;