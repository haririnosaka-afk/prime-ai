"use client";

import { useState } from "react";

export default function Home() {
  const [showGenerator, setShowGenerator] = useState(false);

  return (
    <main style={{
      minHeight: "100vh",
      background: "#080b14",
      color: "white",
      padding: "40px",
      fontFamily: "Arial"
    }}>
      <h1 style={{ color: "#9b6cff" }}>PRIME AI</h1>

      <h2>AI Video Generator</h2>

      <p>Create amazing videos with Artificial Intelligence.</p>

      <button
        onClick={() => setShowGenerator(true)}
        style={{
          background: "#7c3aed",
          color: "white",
          padding: "15px 30px",
          border: "none",
          borderRadius: "10px",
          cursor: "pointer"
        }}
      >
        Create Video
      </button>

      {showGenerator && (
        <section style={{
          marginTop: "35px",
          maxWidth: "600px"
        }}>
          <h2>Create Your Video</h2>

          <label>Upload Image</label>
          <input
            type="file"
            accept="image/*"
            style={{ display: "block", margin: "15px 0" }}
          />

          <label>Video Prompt</label>
          <textarea
            placeholder="Describe the video you want to create..."
            style={{
              display: "block",
              width: "100%",
              height: "120px",
              marginTop: "10px",
              padding: "12px",
              boxSizing: "border-box"
            }}
          />

          <p>Video Duration</p>
          <select>
            <option>5 Seconds</option>
            <option>10 Seconds</option>
          </select>

          <p style={{ color: "#aaa" }}>
            Runway AI integration coming next.
          </p>
        </section>
      )}
    </main>
  );
}
