import { useState } from "react";
import UploadAnswerKey from "./components/UploadAnswerKey";
import UploadOMR from "./components/UploadOMR";
import ResultsTable from "./components/ResultsTable";

export default function App() {
  const [activeTab, setActiveTab] = useState("upload");

  return (
    <div style={{ 
      minHeight: "100vh", 
      backgroundColor: "#f5f5f5",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    }}>
      <div style={{ 
        backgroundColor: "#2c3e50", 
        color: "white", 
        padding: "20px 0",
        marginBottom: "30px"
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px" }}>
          <h1 style={{ margin: 0, fontSize: "2.5rem", fontWeight: "300" }}>
            🎯 OMR Answer Sheet Checker
          </h1>
          <p style={{ margin: "10px 0 0 0", fontSize: "1.1rem", opacity: 0.9 }}>
            Automated OMR processing and scoring system for schools and exams
          </p>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px" }}>
        {/* Navigation Tabs */}
        <div style={{ 
          display: "flex", 
          marginBottom: "30px",
          backgroundColor: "white",
          borderRadius: "8px",
          overflow: "hidden",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
        }}>
          <button
            onClick={() => setActiveTab("upload")}
            style={{
              flex: 1,
              padding: "15px 20px",
              border: "none",
              backgroundColor: activeTab === "upload" ? "#007bff" : "transparent",
              color: activeTab === "upload" ? "white" : "#666",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "500",
              transition: "all 0.3s ease"
            }}
          >
            📝 Upload & Process
          </button>
          <button
            onClick={() => setActiveTab("results")}
            style={{
              flex: 1,
              padding: "15px 20px",
              border: "none",
              backgroundColor: activeTab === "results" ? "#007bff" : "transparent",
              color: activeTab === "results" ? "white" : "#666",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "500",
              transition: "all 0.3s ease"
            }}
          >
            📊 View Results
          </button>
        </div>

        {/* Content based on active tab */}
        {activeTab === "upload" && (
          <div>
            <UploadAnswerKey />
            <UploadOMR />
          </div>
        )}

        {activeTab === "results" && (
          <ResultsTable />
        )}

        {/* Footer */}
        <div style={{ 
          marginTop: "50px", 
          padding: "20px 0", 
          textAlign: "center", 
          color: "#666",
          borderTop: "1px solid #ddd"
        }}>
          <p>OMR Answer Sheet Checker - Built with React, Node.js, and Python</p>
          <p style={{ fontSize: "14px", marginTop: "5px" }}>
            Features: Excel Upload • OMR Processing • Automated Scoring • Results Export
          </p>
        </div>
      </div>
    </div>
  );
}
