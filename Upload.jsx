import { useState, useRef } from "react";

export default function Upload({ onAnalyze, loading, progress, error }) {
  const [papers, setPapers] = useState([]);
  const [syllabus, setSyllabus] = useState(null);
  const papersRef = useRef();
  const syllabusRef = useRef();

  const canSubmit = papers.length > 0 && syllabus && !loading;

  return (
    <div style={styles.container}>
      {/* Hero */}
      <div style={styles.hero}>
        <div style={styles.heroTag}>AI-Powered Exam Intelligence</div>
        <h1 style={styles.heroTitle}>
          Decode Your<br />
          <span style={styles.heroAccent}>Past Papers</span>
        </h1>
        <p style={styles.heroSub}>
          Upload your past question papers and syllabus. Our AI maps topic frequency,
          ranks high-yield topics, and builds your smart study plan.
        </p>
      </div>

      {/* Upload cards */}
      <div style={styles.cards}>
        {/* Papers upload */}
        <div
          style={{ ...styles.card, borderColor: papers.length > 0 ? "rgba(99,102,241,0.6)" : "rgba(255,255,255,0.08)" }}
          onClick={() => papersRef.current.click()}
        >
          <input
            ref={papersRef}
            type="file"
            multiple
            accept=".pdf"
            style={{ display: "none" }}
            onChange={(e) => setPapers([...e.target.files])}
          />
          <div style={styles.cardIcon}>📄</div>
          <div style={styles.cardTitle}>Past Question Papers</div>
          <div style={styles.cardSub}>
            {papers.length > 0
              ? `✓ ${papers.length} file${papers.length > 1 ? "s" : ""} selected`
              : "Click to upload PDF files · Multiple years supported"}
          </div>
          {papers.length > 0 && (
            <div style={styles.fileList}>
              {[...papers].map((f, i) => (
                <div key={i} style={styles.fileChip}>{f.name}</div>
              ))}
            </div>
          )}
        </div>

        {/* Syllabus upload */}
        <div
          style={{ ...styles.card, borderColor: syllabus ? "rgba(16,185,129,0.6)" : "rgba(255,255,255,0.08)" }}
          onClick={() => syllabusRef.current.click()}
        >
          <input
            ref={syllabusRef}
            type="file"
            accept=".pdf"
            style={{ display: "none" }}
            onChange={(e) => setSyllabus(e.target.files[0])}
          />
          <div style={styles.cardIcon}>📋</div>
          <div style={styles.cardTitle}>Official Syllabus</div>
          <div style={styles.cardSub}>
            {syllabus
              ? `✓ ${syllabus.name}`
              : "Click to upload syllabus PDF · Used for gap analysis"}
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div style={styles.errorBox}>
          ⚠ {error}
        </div>
      )}

      {/* Progress */}
      {loading && (
        <div style={styles.progressBox}>
          <div style={styles.spinner} />
          <span>{progress || "Analyzing..."}</span>
        </div>
      )}

      {/* CTA */}
      <button
        style={{ ...styles.btn, opacity: canSubmit ? 1 : 0.4, cursor: canSubmit ? "pointer" : "not-allowed" }}
        disabled={!canSubmit}
        onClick={() => onAnalyze(papers, syllabus)}
      >
        {loading ? "Analyzing with Claude AI..." : "◈ Run AI Analysis"}
      </button>

      {/* Feature pills */}
      <div style={styles.features}>
        {["Topic Frequency Map", "High-Yield Ranking", "Coverage Gaps", "Smart Study Plan", "Practice Questions"].map((f) => (
          <span key={f} style={styles.pill}>{f}</span>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: 760, margin: "0 auto", textAlign: "center" },
  hero: { marginBottom: 48 },
  heroTag: {
    display: "inline-block",
    fontSize: 11,
    fontFamily: "'DM Mono', monospace",
    color: "#a5b4fc",
    border: "1px solid rgba(165,180,252,0.3)",
    padding: "4px 14px",
    borderRadius: 20,
    marginBottom: 20,
    letterSpacing: "0.8px",
    textTransform: "uppercase",
  },
  heroTitle: {
    fontFamily: "'Syne', sans-serif",
    fontSize: "clamp(36px, 6vw, 60px)",
    fontWeight: 800,
    lineHeight: 1.1,
    color: "#e8eaf0",
    marginBottom: 18,
    letterSpacing: "-1.5px",
  },
  heroAccent: {
    background: "linear-gradient(135deg, #6366f1, #06b6d4)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  heroSub: {
    fontSize: 15,
    color: "rgba(232,234,240,0.55)",
    lineHeight: 1.7,
    maxWidth: 520,
    margin: "0 auto",
    fontFamily: "'DM Mono', monospace",
  },
  cards: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 16,
    marginBottom: 24,
  },
  card: {
    background: "rgba(255,255,255,0.03)",
    border: "1.5px dashed",
    borderRadius: 16,
    padding: "32px 24px",
    cursor: "pointer",
    transition: "all 0.2s",
    textAlign: "left",
  },
  cardIcon: { fontSize: 32, marginBottom: 12 },
  cardTitle: {
    fontFamily: "'Syne', sans-serif",
    fontWeight: 700,
    fontSize: 16,
    color: "#e8eaf0",
    marginBottom: 8,
  },
  cardSub: {
    fontSize: 12,
    color: "rgba(232,234,240,0.4)",
    fontFamily: "'DM Mono', monospace",
    lineHeight: 1.5,
  },
  fileList: { marginTop: 12, display: "flex", flexWrap: "wrap", gap: 6 },
  fileChip: {
    background: "rgba(99,102,241,0.15)",
    border: "1px solid rgba(99,102,241,0.3)",
    borderRadius: 6,
    padding: "2px 8px",
    fontSize: 11,
    color: "#a5b4fc",
    fontFamily: "'DM Mono', monospace",
    maxWidth: 180,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  errorBox: {
    background: "rgba(239,68,68,0.1)",
    border: "1px solid rgba(239,68,68,0.3)",
    borderRadius: 10,
    padding: "12px 20px",
    color: "#fca5a5",
    fontSize: 13,
    marginBottom: 16,
    fontFamily: "'DM Mono', monospace",
    textAlign: "left",
  },
  progressBox: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    color: "#a5b4fc",
    fontSize: 13,
    marginBottom: 16,
    fontFamily: "'DM Mono', monospace",
  },
  spinner: {
    width: 16,
    height: 16,
    border: "2px solid rgba(99,102,241,0.3)",
    borderTop: "2px solid #6366f1",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  btn: {
    background: "linear-gradient(135deg, #6366f1, #4f46e5)",
    color: "#fff",
    border: "none",
    padding: "16px 48px",
    borderRadius: 12,
    fontSize: 15,
    fontFamily: "'Syne', sans-serif",
    fontWeight: 700,
    letterSpacing: "0.3px",
    transition: "transform 0.15s, box-shadow 0.15s",
    boxShadow: "0 8px 32px rgba(99,102,241,0.3)",
    marginBottom: 32,
  },
  features: { display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" },
  pill: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 20,
    padding: "4px 14px",
    fontSize: 11,
    color: "rgba(232,234,240,0.45)",
    fontFamily: "'DM Mono', monospace",
  },
};
