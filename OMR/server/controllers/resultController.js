import StudentResult from "../models/StudentResult.js";
import xlsx from "xlsx";
import path from "path";
import fs from "fs";

export const getResultsByExam = async (req, res) => {
  try {
    const { examId } = req.params;
    
    const results = await StudentResult.find({ examId })
      .sort({ score: -1, studentId: 1 })
      .select("-__v");
    
    if (!results.length) {
      return res.status(404).json({ 
        success: false, 
        error: "No results found for this exam" 
      });
    }
    
    // Calculate statistics
    const totalStudents = results.length;
    const averageScore = results.reduce((sum, result) => sum + result.score, 0) / totalStudents;
    const maxScore = Math.max(...results.map(r => r.score));
    const minScore = Math.min(...results.map(r => r.score));
    
    res.json({
      success: true,
      data: {
        results,
        statistics: {
          totalStudents,
          averageScore: Math.round(averageScore * 100) / 100,
          maxScore,
          minScore
        }
      }
    });
  } catch (error) {
    console.error("Error fetching results:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const exportResultsToExcel = async (req, res) => {
  try {
    const { examId } = req.params;
    
    const results = await StudentResult.find({ examId })
      .sort({ score: -1, studentId: 1 })
      .select("-__v -_id");
    
    if (!results.length) {
      return res.status(404).json({ 
        success: false, 
        error: "No results found for this exam" 
      });
    }
    
    // Prepare data for Excel
    const excelData = results.map((result, index) => ({
      Rank: index + 1,
      "Student ID": result.studentId,
      Score: result.score,
      "Total Questions": Object.keys(result.answers).length,
      "Correct Answers": result.correctAnswers || 0,
      "Wrong Answers": result.wrongAnswers || 0,
      "Submission Date": new Date(result.createdAt).toLocaleDateString(),
      ...Object.fromEntries(
        Object.entries(result.answers).map(([question, answer]) => [
          question, answer
        ])
      )
    }));
    
    // Create workbook and worksheet
    const workbook = xlsx.utils.book_new();
    const worksheet = xlsx.utils.json_to_sheet(excelData);
    
    // Auto-size columns
    const colWidths = [];
    excelData.forEach(row => {
      Object.keys(row).forEach((key, index) => {
        const length = Math.max(key.length, String(row[key]).length);
        colWidths[index] = Math.max(colWidths[index] || 0, length);
      });
    });
    
    worksheet["!cols"] = colWidths.map(width => ({ width: width + 2 }));
    
    // Add worksheet to workbook
    xlsx.utils.book_append_sheet(workbook, worksheet, "Results");
    
    // Create filename
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `${examId}_results_${timestamp}.xlsx`;
    
    // Create temp file
    const tempPath = path.join(process.cwd(), "uploads", filename);
    xlsx.writeFile(workbook, tempPath);
    
    // Send file
    res.download(tempPath, filename, (err) => {
      if (err) {
        console.error("Download error:", err);
      }
      // Clean up temp file
      fs.unlink(tempPath, (unlinkErr) => {
        if (unlinkErr) console.error("Error deleting temp file:", unlinkErr);
      });
    });
    
  } catch (error) {
    console.error("Error exporting results:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
