import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";

// Import routes
import omrRoutes from "./routes/omrRoutes.js";
import answerKeyRoutes from "./routes/answerKeyRoutes.js";
import scoringRoutes from "./routes/scoringRoutes.js";
import resultRoutes from "./routes/resultRoutes.js";

// Load environment variables
dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Database connection
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/omr_checker";
mongoose.connect(MONGODB_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// Routes
app.use("/api/omr", omrRoutes);
app.use("/api/answerkey", answerKeyRoutes);
app.use("/api/score", scoringRoutes);
app.use("/api/results", resultRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "OK", service: "OMR Checker Backend" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: "Something went wrong!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Node.js server running on port ${PORT}`);
  console.log(`📊 MongoDB: ${MONGODB_URI}`);
  console.log(`🐍 Python service should be running on port 5001`);
});
