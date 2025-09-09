# Razorpay MERN Project

This project is a full-stack MERN application with Razorpay payment integration.

## Prerequisites
- Node.js (v14+)
- npm
- MongoDB (running locally)

## Folder Structure
```
razorpay-mern p2/
  server/      # Express backend
  frontend/    # React frontend
```

---

## 1. Backend Setup

### Environment Variables
Edit `server/config/config.env` and set:
```
PORT=4000
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
RAZORPAY_API_KEY=your_razorpay_api_key
MONGODB_URI=mongodb://127.0.0.1:27017/razorpayDB
```

### Install Dependencies
```
cd server
npm install
```

### Start MongoDB
Make sure MongoDB is running locally. If installed as a service, start it from Services or use:
```
mongod
```

### Start Backend Server
```
npm run dev
```
Server runs at `http://localhost:4000`

---

## 2. Frontend Setup

### Install Dependencies
```
cd ../frontend
npm install
```

### Start Frontend
```
npm run dev
```
App runs at `http://localhost:5173` (or another port if 5173 is busy)

---

## 3. Payment Flow (Test Mode)
1. Open the frontend in your browser: `http://localhost:5173`
2. Click "Buy now" on a product card.
3. Razorpay modal will open (test credentials).
4. On success, backend verifies payment and saves to MongoDB.
5. You are redirected to `/paymentsuccess?reference=...&amount=...` with payment details.

---

## 4. Useful Commands
- **Install backend dependencies:**
  ```
  cd server
  npm install
  ```
- **Start backend:**
  ```
  npm run dev
  ```
- **Install frontend dependencies:**
  ```
  cd frontend
  npm install
  ```
- **Start frontend:**
  ```
  npm run dev
  ```

---

## 5. Notes
- Use Razorpay test credentials for development.
- Make sure MongoDB is running before starting the backend.
- Environment variables must be set correctly in `server/config/config.env`.
- For any issues, check terminal output for errors.

---

## 6. Troubleshooting
- **MongoDB not running:** Start with `mongod` or check your service manager.
- **Port conflicts:** Change `PORT` in config if needed.
- **Payment details not showing:** Ensure frontend handler redirects with all required query params.

---

## 7. License
MIT
