import express from "express";
import multer from "multer";
import { processOMRAndScore, getStudentResult } from "../controllers/scoringController.js";

const router = express.Router();

// Storage setup for OMR images
const upload = multer({ dest: "uploads/" });

// Process OMR and calculate score
router.post("/process", upload.single("omrSheet"), processOMRAndScore);

// Get individual student result
router.get("/:examId/:studentId", getStudentResult);

export default router;
