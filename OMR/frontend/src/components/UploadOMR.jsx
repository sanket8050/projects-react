import { useState } from "react";
import axios from "axios";

export default function UploadOMR() {
  const [file, setFile] = useState(null);
  const [examId, setExamId] = useState("");
  const [studentId, setStudentId] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [result, setResult] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file || !examId || !studentId) {
      setMessage("Please fill all fields and select a file");
      return;
    }

    const formData = new FormData();
    formData.append("omrSheet", file);
    formData.append("examId", examId);
    formData.append("studentId", studentId);

    setLoading(true);
    setMessage("");
    setResult(null);

    try {
      const response = await axios.post("http://localhost:5000/api/score/process", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        setMessage("✅ OMR processed and scored successfully!");
        setResult(response.data.data);
        setFile(null);
        setExamId("");
        setStudentId("");
        document.getElementById("omrFileInput").value = "";
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
      <h2>📊 Upload OMR Sheet</h2>
      <p style={{ color: "#666", marginBottom: "20px" }}>
        Upload OMR image to process and score automatically
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
            Student ID:
          </label>
          <input
            type="text"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            placeholder="e.g., STU101"
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
            OMR Image:
          </label>
          <input
            id="omrFileInput"
            type="file"
            accept="image/*"
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
            backgroundColor: loading ? "#ccc" : "#28a745",
            color: "white",
            padding: "12px 24px",
            border: "none",
            borderRadius: "4px",
            cursor: loading ? "not-allowed" : "pointer",
            fontSize: "16px",
            fontWeight: "bold"
          }}
        >
          {loading ? "⏳ Processing..." : "📤 Process OMR & Score"}
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

      {result && (
        <div style={{
          marginTop: "20px",
          padding: "15px",
          backgroundColor: "#e7f3ff",
          border: "1px solid #b3d9ff",
          borderRadius: "4px"
        }}>
          <h3 style={{ marginTop: 0, color: "#0056b3" }}>📈 Scoring Results</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "15px" }}>
            <div>
              <strong>Student ID:</strong> {result.studentId}
            </div>
            <div>
              <strong>Score:</strong> {result.score}/{result.totalQuestions}
            </div>
            <div>
              <strong>Percentage:</strong> {result.percentage}%
            </div>
            <div>
              <strong>Correct:</strong> {result.correctAnswers}
            </div>
            <div>
              <strong>Wrong:</strong> {result.wrongAnswers}
            </div>
          </div>
          
          <details style={{ marginTop: "15px" }}>
            <summary style={{ cursor: "pointer", fontWeight: "bold", color: "#0056b3" }}>
              View Detailed Answers
            </summary>
            <div style={{ marginTop: "10px", padding: "10px", backgroundColor: "white", borderRadius: "4px" }}>
              {Object.entries(result.answers).map(([question, answer]) => (
                <div key={question} style={{ marginBottom: "5px" }}>
                  <strong>{question}:</strong> {answer}
                </div>
              ))}
            </div>
          </details>
        </div>
      )}
    </div>
  );
}
