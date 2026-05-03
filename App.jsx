import { useState } from "react";
import Upload from "./components/Upload";
import Dashboard from "./components/Dashboard";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";

export default function App() {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState("");

  const handleAnalyze = async (papers, syllabus) => {
    setLoading(true);
    setError(null);
    setProgress("Extracting text from PDFs...");

    const formData = new FormData();
    papers.forEach((p) => formData.append("papers", p));
    formData.append("syllabus", syllabus);

    try {
      setProgress("Sending to Claude AI for deep analysis...");
      const res = await fetch(`${BACKEND_URL}/analyze`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Server error");
      }

      setProgress("Processing results...");
      const data = await res.json();
      setResults(data);
    } catch (err) {
      setError(err.message || "Something went wrong. Make sure the backend is running.");
    } finally {
      setLoading(false);
      setProgress("");
    }
  };

  return (
    <div style={styles.app}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.logo}>
          <span style={styles.logoIcon}>◈</span>
          <span style={styles.logoText}>PaperLens</span>
        </div>
        <span style={styles.badge}>AI DecodeX Hackathon</span>
      </header>

      {/* Main content */}
      <main style={styles.main}>
        {!results ? (
          <Upload
            onAnalyze={handleAnalyze}
            loading={loading}
            progress={progress}
            error={error}
          />
        ) : (
          <Dashboard data={results} onReset={() => setResults(null)} />
        )}
      </main>

      {/* Footer */}
      <footer style={styles.footer}>
        Built for AI DecodeX · UnsaidTalks Education
      </footer>
    </div>
  );
}

const styles = {
  app: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    background: "#050810",
    backgroundImage: `
      radial-gradient(ellipse at 20% 0%, rgba(99,102,241,0.12) 0%, transparent 60%),
      radial-gradient(ellipse at 80% 100%, rgba(16,185,129,0.08) 0%, transparent 60%)
    `,
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 40px",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontFamily: "'Syne', sans-serif",
    fontWeight: 800,
    fontSize: "22px",
    letterSpacing: "-0.5px",
  },
  logoIcon: { color: "#6366f1", fontSize: "20px" },
  logoText: { color: "#e8eaf0" },
  badge: {
    fontSize: "11px",
    fontFamily: "'DM Mono', monospace",
    color: "#6ee7b7",
    border: "1px solid rgba(110,231,183,0.3)",
    padding: "4px 12px",
    borderRadius: "20px",
    letterSpacing: "0.5px",
  },
  main: {
    flex: 1,
    padding: "40px 20px",
  },
  footer: {
    textAlign: "center",
    padding: "20px",
    fontSize: "12px",
    color: "rgba(255,255,255,0.2)",
    borderTop: "1px solid rgba(255,255,255,0.04)",
    fontFamily: "'DM Mono', monospace",
  },
};
