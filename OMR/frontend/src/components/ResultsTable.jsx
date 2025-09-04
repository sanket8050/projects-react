import { useState, useEffect } from "react";
import axios from "axios";

export default function ResultsTable({ examId }) {
  const [results, setResults] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [examIdInput, setExamIdInput] = useState(examId || "");

  const fetchResults = async () => {
    if (!examIdInput) {
      setError("Please enter an Exam ID");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.get(`http://localhost:5000/api/results/${examIdInput}`);
      
      if (response.data.success) {
        setResults(response.data.data.results);
        setStatistics(response.data.data.statistics);
      }
    } catch (error) {
      setError(error.response?.data?.error || "Failed to fetch results");
      setResults([]);
      setStatistics(null);
    } finally {
      setLoading(false);
    }
  };

  const exportResults = async () => {
    if (!examIdInput) {
      setError("Please enter an Exam ID");
      return;
    }

    try {
      const response = await axios.get(`http://localhost:5000/api/results/${examIdInput}/export`, {
        responseType: 'blob'
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${examIdInput}_results.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      setError("Failed to export results");
    }
  };

  useEffect(() => {
    if (examId) {
      fetchResults();
    }
  }, [examId]);

  return (
    <div style={{ 
      border: "1px solid #ddd", 
      padding: "20px", 
      borderRadius: "8px", 
      marginBottom: "20px",
      backgroundColor: "#f9f9f9"
    }}>
      <h2>📊 Exam Results</h2>
      
      <div style={{ marginBottom: "20px" }}>
        <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
          <input
            type="text"
            value={examIdInput}
            onChange={(e) => setExamIdInput(e.target.value)}
            placeholder="Enter Exam ID"
            style={{
              flex: 1,
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              fontSize: "14px"
            }}
          />
          <button
            onClick={fetchResults}
            disabled={loading}
            style={{
              backgroundColor: "#007bff",
              color: "white",
              padding: "10px 20px",
              border: "none",
              borderRadius: "4px",
              cursor: loading ? "not-allowed" : "pointer",
              fontSize: "14px"
            }}
          >
            {loading ? "⏳ Loading..." : "🔍 Fetch Results"}
          </button>
          {results.length > 0 && (
            <button
              onClick={exportResults}
              style={{
                backgroundColor: "#28a745",
                color: "white",
                padding: "10px 20px",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "14px"
              }}
            >
              📥 Export Excel
            </button>
          )}
        </div>
      </div>

      {error && (
        <div style={{
          padding: "10px",
          backgroundColor: "#f8d7da",
          color: "#721c24",
          border: "1px solid #f5c6cb",
          borderRadius: "4px",
          marginBottom: "15px"
        }}>
          ❌ {error}
        </div>
      )}

      {statistics && (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: "15px",
          marginBottom: "20px",
          padding: "15px",
          backgroundColor: "#e7f3ff",
          borderRadius: "4px"
        }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "24px", fontWeight: "bold", color: "#0056b3" }}>
              {statistics.totalStudents}
            </div>
            <div style={{ fontSize: "14px", color: "#666" }}>Total Students</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "24px", fontWeight: "bold", color: "#28a745" }}>
              {statistics.averageScore}
            </div>
            <div style={{ fontSize: "14px", color: "#666" }}>Average Score</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "24px", fontWeight: "bold", color: "#ffc107" }}>
              {statistics.maxScore}
            </div>
            <div style={{ fontSize: "14px", color: "#666" }}>Highest Score</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "24px", fontWeight: "bold", color: "#dc3545" }}>
              {statistics.minScore}
            </div>
            <div style={{ fontSize: "14px", color: "#666" }}>Lowest Score</div>
          </div>
        </div>
      )}

      {results.length > 0 && (
        <div style={{ overflowX: "auto" }}>
          <table style={{
            width: "100%",
            borderCollapse: "collapse",
            backgroundColor: "white",
            borderRadius: "4px",
            overflow: "hidden"
          }}>
            <thead>
              <tr style={{ backgroundColor: "#f8f9fa" }}>
                <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #dee2e6" }}>Rank</th>
                <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #dee2e6" }}>Student ID</th>
                <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #dee2e6" }}>Score</th>
                <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #dee2e6" }}>Percentage</th>
                <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #dee2e6" }}>Correct</th>
                <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #dee2e6" }}>Wrong</th>
                <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #dee2e6" }}>Submitted</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result, index) => (
                <tr key={result._id} style={{ borderBottom: "1px solid #dee2e6" }}>
                  <td style={{ padding: "12px" }}>{index + 1}</td>
                  <td style={{ padding: "12px", fontWeight: "bold" }}>{result.studentId}</td>
                  <td style={{ padding: "12px" }}>{result.score}/{result.totalQuestions}</td>
                  <td style={{ padding: "12px" }}>{result.percentage}%</td>
                  <td style={{ padding: "12px", color: "#28a745" }}>{result.correctAnswers}</td>
                  <td style={{ padding: "12px", color: "#dc3545" }}>{result.wrongAnswers}</td>
                  <td style={{ padding: "12px", fontSize: "12px" }}>
                    {new Date(result.submittedAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && !error && results.length === 0 && examIdInput && (
        <div style={{
          padding: "20px",
          textAlign: "center",
          color: "#666",
          backgroundColor: "white",
          borderRadius: "4px"
        }}>
          📭 No results found for this exam
        </div>
      )}
    </div>
  );
}
