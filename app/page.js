export default function Home() {
  return (
    <main style={{
      minHeight: "100vh",
      background: "#080b14",
      color: "white",
      padding: "40px",
      fontFamily: "Arial"
    }}>
      <h1 style={{color: "#8b5cf6"}}>
        PRIME AI
      </h1>

      <h2>AI Video Generator</h2>

      <p>
        Create amazing videos with Artificial Intelligence.
      </p>

      <button style={{
        background: "#7c3aed",
        color: "white",
        padding: "15px 30px",
        border: "none",
        borderRadius: "10px",
        cursor: "pointer"
      }}>
        Create Video
      </button>
    </main>
  );
}
