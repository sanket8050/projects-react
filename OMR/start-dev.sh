#!/bin/bash

echo "🚀 Starting OMR Answer Sheet Checker Development Environment..."
echo

echo "📊 Starting MongoDB (if not running)..."
echo "Please ensure MongoDB is running on localhost:27017"
echo

echo "🐍 Starting Python OMR Service..."
cd python-service
python app.py &
PYTHON_PID=$!
cd ..

echo "🔧 Starting Node.js Backend..."
cd server
npm run dev &
NODE_PID=$!
cd ..

echo "⚛️ Starting React Frontend..."
cd frontend
npm run dev &
REACT_PID=$!
cd ..

echo
echo "✅ All services are starting up!"
echo
echo "🌐 Frontend: http://localhost:5173"
echo "🔧 Backend: http://localhost:5000"
echo "🐍 Python: http://localhost:5001"
echo
echo "Press Ctrl+C to stop all services..."

# Function to cleanup processes on exit
cleanup() {
    echo
    echo "🛑 Stopping all services..."
    kill $PYTHON_PID $NODE_PID $REACT_PID 2>/dev/null
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Wait for user to stop
wait
