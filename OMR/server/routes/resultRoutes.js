import express from "express";
import { getResultsByExam, exportResultsToExcel } from "../controllers/resultController.js";

const router = express.Router();

// Get all results for a specific exam
router.get("/:examId", getResultsByExam);

// Export results to Excel
router.get("/:examId/export", exportResultsToExcel);

export default router;
