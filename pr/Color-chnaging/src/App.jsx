import { useState } from 'react';
import './App.css';

function App() {
  const [color, setColor] = useState('#212121');

  return (
    <div className="w-full h-screen duration-200" style={{ backgroundColor: color }}>
      {/* Button Panel */}
      <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 bg-white rounded-lg px-6 py-4 flex flex-wrap justify-center gap-4 shadow-md">
        {/* Red */}
        <button
          className="h-10 w-20 rounded font-bold text-white"
          style={{ backgroundColor: 'red' }}
          onClick={() => setColor('red')}
        >
          Red
        </button>

        {/* Green */}
        <button
          className="h-10 w-20 rounded font-bold text-white"
          style={{ backgroundColor: 'green' }}
          onClick={() => setColor('green')}
        >
          Green
        </button>

        {/* Blue */}
        <button
          className="h-10 w-20 rounded font-bold text-white"
          style={{ backgroundColor: 'blue' }}
          onClick={() => setColor('blue')}
        >
          Blue
        </button>

        {/* White */}
        <button
          className="h-10 w-20 rounded font-bold text-black border border-gray-300"
          style={{ backgroundColor: 'white' }}
          onClick={() => setColor('white')}
        >
          White
        </button>

        <button
          className="h-10 w-20 rounded font-bold text-white"
          style={{ backgroundColor: 'violet' }}
          onClick={() => setColor('violet')}
        >
          violet
        </button>

        {/* Green */}
        <button
          className="h-10 w-20 rounded font-bold text-white"
          style={{ backgroundColor: 'pink' }}
          onClick={() => setColor('pink')}
        >
          pink
        </button>

        {/* Blue */}
        <button
          className="h-10 w-20 rounded font-bold text-white"
          style={{ backgroundColor: 'lavender' }}
          onClick={() => setColor('lavender')}
        >
          lavender
        </button>

        {/* White */}
        <button
          className="h-10 w-20 rounded font-bold text-black border border-gray-300"
          style={{ backgroundColor: 'olive' }}
          onClick={() => setColor('olive')}
        >
          olive
        </button> 
      
        
      </div>
    </div>
  );
}

export default App;
