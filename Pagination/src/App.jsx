// src/App.jsx
// Pagination example for a Vite + React app.
// Drop this file into your Vite project's `src/` folder (replace the default App.jsx)
// or copy the <Pagination /> component into `src/components/Pagination.jsx` and import it from App.jsx.

import React, { useState, useMemo } from "react";

// SAMPLE DATA: you can replace this with props or fetched data.
const sampleItems = Array.from({ length: 20 }, (_, i) => `Item ${i + 1}`);

// Pagination component: shows `pageSize` items at a time and provides Prev/Next + jump buttons
export function Pagination({ items = sampleItems, pageSize = 3 }) {
  // current page index (0-based)
  const [page, setPage] = useState(0);

  // how many pages in total
  const totalPages = Math.ceil(items.length / pageSize);

  // where the current window starts in the array
  const startIndex = page * pageSize;

  // slice the items for the current page. useMemo is optional but avoids re-slicing on unrelated rerenders
  const currentItems = useMemo(() => {
    return items.slice(startIndex, startIndex + pageSize);
  }, [items, startIndex, pageSize]);

  // move back, but never below 0
  function handlePrev() {
    setPage((p) => Math.max(0, p - 1));
  }

  // move forward, but never past last page
  function handleNext() {
    setPage((p) => Math.min(totalPages - 1, p + 1));
  }

  // jump to a specific page (safely clamped)
  function jumpTo(p) {
    setPage(Math.max(0, Math.min(totalPages - 1, p)));
  }

  return (
    <div style={{ maxWidth: 680, margin: "2rem auto", fontFamily: "system-ui, sans-serif" }}>
      <h1 style={{ marginBottom: 8 }}>Pagination — show {pageSize} items at a time</h1>

      <div style={{ marginBottom: 12, color: "#555" }}>
        Page <strong>{page + 1}</strong> of <strong>{totalPages}</strong>
      </div>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {currentItems.map((item, idx) => (
          <li
            key={startIndex + idx}
            style={{
              padding: "10px 12px",
              border: "1px solid #e3e3e3",
              borderRadius: 8,
              marginBottom: 8,
              background: "#fff",
            }}
          >
            {item}
          </li>
        ))}
      </ul>

      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12 }}>
        <button onClick={handlePrev} disabled={page === 0} aria-label="Previous page">
          Prev
        </button>

        <button onClick={handleNext} disabled={page === totalPages - 1} aria-label="Next page">
          Next
        </button>

        {/* simple page-jump UI */}
        <div style={{ marginLeft: "auto", display: "flex", gap: 6, alignItems: "center" }}>
          <span style={{ color: "#666" }}>Jump:</span>
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => jumpTo(i)}
              aria-current={i === page ? "true" : undefined}
              style={{
                minWidth: 36,
                padding: "6px 8px",
                borderRadius: 6,
                border: i === page ? "2px solid #111" : "1px solid #ddd",
                fontWeight: i === page ? 700 : 400,
              }}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Hint about an edge case: last page can have fewer items than pageSize */}
      <p style={{ marginTop: 10, color: "#666" }}>
        Note: the last page may show fewer than {pageSize} items if the total number of items is not a
        multiple of {pageSize}.
      </p>
    </div>
  );
}

// Default App — renders the Pagination component. Replace your project's App.jsx with this
export default function App() {
  return <Pagination />;
}
