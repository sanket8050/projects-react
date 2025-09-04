import { callPythonOMR } from "../utils/callPython.js";
import path from "path";

export const processOMR = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: "No file uploaded" });
    }

    const imagePath = path.resolve(req.file.path); // full path to uploaded file
    console.log("Uploaded file path:", imagePath);

    const omrResult = await callPythonOMR(imagePath);

    res.json({ success: true, data: omrResult });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
