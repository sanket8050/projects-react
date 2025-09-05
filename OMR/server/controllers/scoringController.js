import StudentResult from "../models/StudentResult.js";
import AnswerKey from "../models/AnswerKey.js";
import { callPythonOMR } from "../utils/callPython.js";
import path from "path";

export const processOMRAndScore = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: "No OMR image uploaded" });
    }

    const { examId, studentId } = req.body;
    
    if (!examId || !studentId) {
      return res.status(400).json({ 
        success: false, 
        error: "examId and studentId are required" 
      });
    }

    // Check if answer key exists for this exam
    const answerKey = await AnswerKey.findOne({ examId });
    if (!answerKey) {
      return res.status(404).json({ 
        success: false, 
        error: "Answer key not found for this exam" 
      });
    }

    // Check if student already has results for this exam
    const existingResult = await StudentResult.findOne({ examId, studentId });
    if (existingResult) {
      return res.status(400).json({ 
        success: false, 
        error: "Student already has results for this exam" 
      });
    }

    // Process OMR image using Python service
    const imagePath = path.resolve(req.file.path);
    const omrResult = await callPythonOMR(imagePath);
    
    if (!omrResult.success || !omrResult.answers) {
      return res.status(500).json({ 
        success: false, 
        error: "Failed to process OMR image" 
      });
    }

    // Calculate score by comparing with answer key
    const studentAnswers = omrResult.answers;
    const correctAnswers = answerKey.answers;
    
    let score = 0;
    let correctCount = 0;
    let wrongCount = 0;
    
    Object.keys(correctAnswers).forEach(question => {
      if (studentAnswers[question] === correctAnswers[question]) {
        score++;
        correctCount++;
      } else {
        wrongCount++;
      }
    });

    // Create student result
    const studentResult = new StudentResult({
      examId,
      studentId,
      answers: studentAnswers,
      score,
      correctAnswers: correctCount,
      wrongAnswers: wrongCount,
      totalQuestions: Object.keys(correctAnswers).length,
      percentage: Math.round((score / Object.keys(correctAnswers).length) * 100),
      submittedAt: new Date()
    });

    await studentResult.save();

    res.json({
      success: true,
      message: "OMR processed and scored successfully",
      data: {
        examId,
        studentId,
        score,
        totalQuestions: Object.keys(correctAnswers).length,
        correctAnswers: correctCount,
        wrongAnswers: wrongCount,
        percentage: Math.round((score / Object.keys(correctAnswers).length) * 100),
        answers: studentAnswers
      }
    });

  } catch (error) {
    console.error("Error processing OMR and scoring:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getStudentResult = async (req, res) => {
  try {
    const { examId, studentId } = req.params;
    
    const result = await StudentResult.findOne({ examId, studentId });
    
    if (!result) {
      return res.status(404).json({ 
        success: false, 
        error: "Result not found" 
      });
    }
    
    res.json({
      success: true,
      data: result
    });
    
  } catch (error) {
    console.error("Error fetching student result:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
