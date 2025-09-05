import express from "express";
import multer from "multer";
import { uploadAnswerKey } from "../controllers/answerKeyController.js";

const router = express.Router();

// Storage setup for Excel files
const upload = multer({ dest: "uploads/" });

// Upload answer key (Excel file)
router.post("/upload", upload.single("answerKey"), uploadAnswerKey);

export default router;
