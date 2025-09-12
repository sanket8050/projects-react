import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  async function fetchData() {
    try {
      setLoading(true);
      const response = await fetch("https://jsonplaceholder.typicode.com/users");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          Count is {count}
        </button>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <ul>{data.length > 0 
            ? (
              data.map((user, index) => (
                <div key={index}>
                  <p>{user.xname}</p>
                  <p>{user.username}</p>
                </div>
              ))
            ) : (
              <p>No data available</p>
            )}
          </ul>
        )}
      </div>
    </>
  );
}

export default App;