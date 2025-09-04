import xlsx from "xlsx";
import AnswerKey from "../models/AnswerKey.js";

export const uploadAnswerKey = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: "No file uploaded" });
    }

    const { examId, examName } = req.body;
    
    if (!examId || !examName) {
      return res.status(400).json({ 
        success: false, 
        error: "examId and examName are required" 
      });
    }

    // Check if answer key already exists for this exam
    const existingKey = await AnswerKey.findOne({ examId });
    if (existingKey) {
      return res.status(400).json({ 
        success: false, 
        error: "Answer key already exists for this exam" 
      });
    }

    // Parse Excel file
    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Convert to JSON
    const data = xlsx.utils.sheet_to_json(worksheet);
    
    if (!data.length) {
      return res.status(400).json({ 
        success: false, 
        error: "Excel file is empty or invalid" 
      });
    }

    // Extract answers from Excel data
    const answers = {};
    data.forEach((row, index) => {
      // Handle different Excel formats
      const question = row.Question || row.question || row.Q || `Q${index + 1}`;
      const answer = row.Answer || row.answer || row.A || row.Ans;
      
      if (question && answer) {
        answers[question] = answer.toString().toUpperCase();
      }
    });

    if (Object.keys(answers).length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: "No valid question-answer pairs found in Excel" 
      });
    }

    // Create answer key document
    const answerKey = new AnswerKey({
      examId,
      examName,
      answers,
      totalQuestions: Object.keys(answers).length,
      uploadedAt: new Date()
    });

    await answerKey.save();

    res.json({
      success: true,
      message: "Answer key uploaded successfully",
      data: {
        examId,
        examName,
        totalQuestions: Object.keys(answers).length,
        answers
      }
    });

  } catch (error) {
    console.error("Error uploading answer key:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
