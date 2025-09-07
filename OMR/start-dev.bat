@echo off
echo 🚀 Starting OMR Answer Sheet Checker Development Environment...
echo.

echo 📊 Starting MongoDB (if not running)...
echo Please ensure MongoDB is running on localhost:27017
echo.

echo 🐍 Starting Python OMR Service...
start "Python OMR Service" cmd /k "cd python-service && python app.py"
timeout /t 3 /nobreak >nul

echo 🔧 Starting Node.js Backend...
start "Node.js Backend" cmd /k "cd server && npm run dev"
timeout /t 3 /nobreak >nul

echo ⚛️ Starting React Frontend...
start "React Frontend" cmd /k "cd frontend && npm run dev"
timeout /t 3 /nobreak >nul

echo.
echo ✅ All services are starting up!
echo.
echo 🌐 Frontend: http://localhost:5173
echo 🔧 Backend: http://localhost:5000
echo 🐍 Python: http://localhost:5001
echo.
echo Press any key to close this window...
pause >nul
