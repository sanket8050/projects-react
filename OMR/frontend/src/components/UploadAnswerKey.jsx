import { useState } from "react";
import axios from "axios";

export default function UploadAnswerKey() {
  const [file, setFile] = useState(null);
  const [examId, setExamId] = useState("");
  const [examName, setExamName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file || !examId || !examName) {
      setMessage("Please fill all fields and select a file");
      return;
    }

    const formData = new FormData();
    formData.append("answerKey", file);
    formData.append("examId", examId);
    formData.append("examName", examName);

    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post("http://localhost:5000/api/answerkey/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        setMessage(`✅ Answer key uploaded successfully! ${response.data.data.totalQuestions} questions processed.`);
        setFile(null);
        setExamId("");
        setExamName("");
        document.getElementById("fileInput").value = "";
      }
    } catch (error) {
      setMessage(`❌ Error: ${error.response?.data?.error || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      border: "1px solid #ddd", 
      padding: "20px", 
      borderRadius: "8px", 
      marginBottom: "20px",
      backgroundColor: "#f9f9f9"
    }}>
      <h2>📝 Upload Answer Key</h2>
      <p style={{ color: "#666", marginBottom: "20px" }}>
        Upload Excel file with Question | Answer format
      </p>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
            Exam ID:
          </label>
          <input
            type="text"
            value={examId}
            onChange={(e) => setExamId(e.target.value)}
            placeholder="e.g., Scholarship2025"
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              fontSize: "14px"
            }}
            required
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
            Exam Name:
          </label>
          <input
            type="text"
            value={examName}
            onChange={(e) => setExamName(e.target.value)}
            placeholder="e.g., Annual Scholarship Test"
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              fontSize: "14px"
            }}
            required
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
            Excel File:
          </label>
          <input
            id="fileInput"
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileChange}
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              fontSize: "14px"
            }}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            backgroundColor: loading ? "#ccc" : "#007bff",
            color: "white",
            padding: "12px 24px",
            border: "none",
            borderRadius: "4px",
            cursor: loading ? "not-allowed" : "pointer",
            fontSize: "16px",
            fontWeight: "bold"
          }}
        >
          {loading ? "⏳ Uploading..." : "📤 Upload Answer Key"}
        </button>
      </form>

      {message && (
        <div style={{
          marginTop: "15px",
          padding: "10px",
          borderRadius: "4px",
          backgroundColor: message.includes("✅") ? "#d4edda" : "#f8d7da",
          color: message.includes("✅") ? "#155724" : "#721c24",
          border: `1px solid ${message.includes("✅") ? "#c3e6cb" : "#f5c6cb"}`
        }}>
          {message}
        </div>
      )}
    </div>
  );
}
