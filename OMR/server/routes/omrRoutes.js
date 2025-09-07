import express from "express";
import multer from "multer";
import { processOMR } from "../controllers/omrController.js";

const router = express.Router();

// Storage setup for OMR images
const upload = multer({ dest: "uploads/" });

// Process OMR image (returns answers without scoring)
router.post("/process", upload.single("omrSheet"), processOMR);

export default router;
