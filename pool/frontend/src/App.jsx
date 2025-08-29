import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [students, setStudents] = useState([]);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Fetch all students from backend
  useEffect(() => {
    axios.get("http://localhost:4000/api/students") // adjust port if needed
      .then(res => setStudents(res.data))
      .catch(err => console.error(err));
  }, []);

  // Handle search input
  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.trim() === "") {
      setSuggestions([]);
      setSelectedStudent(null);
      return;
    }

    // Filter students based on seat_no or name
    const filtered = students.filter(student =>
      student.seat_no.toLowerCase().includes(value.toLowerCase()) ||
      student.name.toLowerCase().includes(value.toLowerCase())
    );

    setSuggestions(filtered.slice(0, 5)); // show top 5 suggestions
  };

  // Handle suggestion click
  const handleSelect = (student) => {
    setQuery(student.seat_no); // fill input with seat no
    setSelectedStudent(student);
    setSuggestions([]);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>📘 PDF Extraction App</h1>

      {/* Search input */}
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Search by Seat No or Name"
        style={{ padding: "8px", width: "300px" }}
      />

      {/* Suggestion dropdown */}
      {suggestions.length > 0 && (
        <ul style={{
          listStyle: "none",
          padding: "0",
          marginTop: "5px",
          border: "1px solid #ccc",
          width: "300px",
          background: "white",
          position: "absolute",
          zIndex: 1
        }}>
          {suggestions.map((s, idx) => (
            <li
              key={idx}
              onClick={() => handleSelect(s)}
              style={{
                padding: "8px",
                cursor: "pointer",
                borderBottom: "1px solid #eee"
              }}
            >
              {s.seat_no} - {s.name}
            </li>
          ))}
        </ul>
      )}

      {/* Selected student details */}
      {selectedStudent && (
        <div style={{ marginTop: "20px" }}>
          <h2>{selectedStudent.name}</h2>
          <p><b>Seat No:</b> {selectedStudent.seat_no}</p>
          <p><b>PRN:</b> {selectedStudent.prn}</p>
          <p><b>College:</b> {selectedStudent.college}</p>
          <p><b>Mother's Name:</b> {selectedStudent.mother}</p>

          <h3>Semesters:</h3>
          {selectedStudent.semesters.map((sem, i) => (
            <div key={i} style={{ marginBottom: "15px" }}>
              <h4>Semester {sem.semester}</h4>
              <table border="1" cellPadding="5">
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Subject</th>
                    <th>ISE</th>
                    <th>ESE</th>
                    <th>Total</th>
                    <th>Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {sem.subjects.map((sub, j) => (
                    <tr key={j}>
                      <td>{sub.subject_code}</td>
                      <td>{sub.subject_name}</td>
                      <td>{sub.ise}</td>
                      <td>{sub.ese}</td>
                      <td>{sub.total}</td>
                      <td>{sub.grade}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
