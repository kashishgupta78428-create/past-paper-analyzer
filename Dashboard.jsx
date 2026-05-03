import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, Legend,
} from "recharts";

const COLORS = ["#6366f1", "#06b6d4", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

export default function Dashboard({ data, onReset }) {
  const topicData = Object.entries(data.topic_frequency || {})
    .map(([name, value]) => ({ name: name.length > 20 ? name.slice(0, 18) + "…" : name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);

  const difficultyData = [
    { name: "Easy", value: data.difficulty_distribution?.easy || 0 },
    { name: "Medium", value: data.difficulty_distribution?.medium || 0 },
    { name: "Hard", value: data.difficulty_distribution?.hard || 0 },
  ];

  const questionTypeData = Object.entries(data.question_type_distribution || {}).map(
    ([name, value]) => ({ name, value })
  );

  const highYield = data.high_yield_topics || [];
  const gaps = data.coverage_gaps || [];
  const planner = data.study_planner || [];
  const practiceQs = data.practice_questions || [];
  const tips = data.exam_strategy_tips || [];

  const priorityColor = {
    critical: "#ef4444",
    high: "#f59e0b",
    medium: "#06b6d4",
    low: "#10b981",
  };

  return (
    <div style={styles.container}>
      {/* Top bar */}
      <div style={styles.topBar}>
        <div>
          <div style={styles.pageTitle}>Analysis Report</div>
          <div style={styles.pageSub}>
            {data.total_papers_analyzed} papers analyzed · AI-powered insights
          </div>
        </div>
        <button style={styles.resetBtn} onClick={onReset}>
          ← New Analysis
        </button>
      </div>

      {/* Stats row */}
      <div style={styles.statsRow}>
        {[
          { label: "Papers Analyzed", value: data.total_papers_analyzed || "—" },
          { label: "Topics Found", value: Object.keys(data.topic_frequency || {}).length },
          { label: "High-Yield Topics", value: highYield.length },
          { label: "Coverage Gaps", value: gaps.length },
        ].map((s) => (
          <div key={s.label} style={styles.statCard}>
            <div style={styles.statValue}>{s.value}</div>
            <div style={styles.statLabel}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Grid: charts */}
      <div style={styles.grid2}>
        {/* Topic Frequency Bar */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>📊 Topic Frequency (Top 10)</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={topicData} margin={{ left: -10 }}>
              <XAxis dataKey="name" tick={{ fill: "#9ca3af", fontSize: 10 }} />
              <YAxis tick={{ fill: "#9ca3af", fontSize: 11 }} />
              <Tooltip
                contentStyle={{ background: "#0f1120", border: "1px solid #2d2f45", borderRadius: 8 }}
                labelStyle={{ color: "#e8eaf0" }}
                itemStyle={{ color: "#a5b4fc" }}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {topicData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Difficulty Pie */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>🎯 Difficulty Distribution</h2>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={difficultyData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={3}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}%`}
                labelLine={{ stroke: "rgba(255,255,255,0.2)" }}
              >
                {difficultyData.map((_, i) => (
                  <Cell key={i} fill={["#10b981", "#f59e0b", "#ef4444"][i]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: "#0f1120", border: "1px solid #2d2f45", borderRadius: 8 }}
                formatter={(v) => `${v}%`}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Question Type Radar */}
      {questionTypeData.length > 0 && (
        <div style={{ ...styles.card, marginBottom: 20 }}>
          <h2 style={styles.cardTitle}>🔍 Question Type Distribution</h2>
          <ResponsiveContainer width="100%" height={240}>
            <RadarChart data={questionTypeData}>
              <PolarGrid stroke="rgba(255,255,255,0.08)" />
              <PolarAngleAxis dataKey="name" tick={{ fill: "#9ca3af", fontSize: 12 }} />
              <Radar dataKey="value" stroke="#6366f1" fill="#6366f1" fillOpacity={0.25} />
              <Tooltip
                contentStyle={{ background: "#0f1120", border: "1px solid #2d2f45", borderRadius: 8 }}
                formatter={(v) => `${v}%`}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* High Yield Topics */}
      <div style={styles.card}>
        <h2 style={styles.cardTitle}>🏆 High-Yield Topics (Ranked)</h2>
        <div style={styles.highYieldList}>
          {highYield.map((t, i) => (
            <div key={i} style={styles.highYieldItem}>
              <div style={styles.hyRank}>#{i + 1}</div>
              <div style={{ flex: 1 }}>
                <div style={styles.hyTopic}>{t.topic}</div>
                <div style={styles.hyReason}>{t.reason}</div>
              </div>
              <div style={styles.hyScore}>
                <div style={{ ...styles.hyScoreBar, width: `${t.score}%` }} />
                <span style={styles.hyScoreNum}>{t.score}/100</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Coverage Gaps */}
      {gaps.length > 0 && (
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>⚠️ Syllabus Coverage Gaps</h2>
          <div style={styles.gapGrid}>
            {gaps.map((g, i) => (
              <div key={i} style={{ ...styles.gapItem, borderColor: g.risk === "high" ? "rgba(239,68,68,0.4)" : g.risk === "medium" ? "rgba(245,158,11,0.4)" : "rgba(16,185,129,0.4)" }}>
                <div style={styles.gapRisk(g.risk)}>{g.risk}</div>
                <div style={styles.gapTopic}>{g.topic}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Smart Study Planner */}
      <div style={styles.card}>
        <h2 style={styles.cardTitle}>📅 Smart Study Planner</h2>
        <div style={styles.plannerList}>
          {planner.map((w, i) => (
            <div key={i} style={styles.plannerItem}>
              <div style={styles.plannerWeek}>
                <div style={styles.plannerWeekNum}>Week {w.week}</div>
                <div style={{ ...styles.plannerPriority, background: `${priorityColor[w.priority]}22`, color: priorityColor[w.priority], border: `1px solid ${priorityColor[w.priority]}44` }}>
                  {w.priority}
                </div>
              </div>
              <div style={styles.plannerTopics}>
                {(w.topics || []).map((t, j) => (
                  <span key={j} style={styles.topicTag}>{t}</span>
                ))}
              </div>
              <div style={styles.plannerMeta}>
                <span>⏱ {w.hours}h recommended</span>
                <span style={styles.plannerFocus}>{w.focus}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Practice Questions */}
      {practiceQs.length > 0 && (
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>📝 Practice Questions</h2>
          <div style={styles.practiceList}>
            {practiceQs.slice(0, 8).map((q, i) => (
              <div key={i} style={styles.practiceItem}>
                <div style={styles.practiceHeader}>
                  <span style={styles.practiceTag}>{q.topic}</span>
                  <span style={styles.practiceDiff(q.difficulty)}>{q.difficulty}</span>
                  <span style={styles.practiceMarks}>{q.marks} marks</span>
                </div>
                <div style={styles.practiceQ}>Q{i + 1}. {q.question}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Exam Tips */}
      {tips.length > 0 && (
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>💡 Exam Strategy Tips</h2>
          <ul style={styles.tipsList}>
            {tips.map((tip, i) => (
              <li key={i} style={styles.tipItem}>
                <span style={styles.tipBullet}>→</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { maxWidth: 960, margin: "0 auto" },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 32,
  },
  pageTitle: {
    fontFamily: "'Syne', sans-serif",
    fontWeight: 800,
    fontSize: 28,
    color: "#e8eaf0",
    letterSpacing: "-0.5px",
  },
  pageSub: { fontSize: 12, color: "rgba(232,234,240,0.4)", fontFamily: "'DM Mono', monospace", marginTop: 4 },
  resetBtn: {
    background: "transparent",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "rgba(232,234,240,0.6)",
    padding: "8px 20px",
    borderRadius: 8,
    cursor: "pointer",
    fontFamily: "'DM Mono', monospace",
    fontSize: 12,
  },
  statsRow: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20 },
  statCard: {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: 12,
    padding: "20px",
    textAlign: "center",
  },
  statValue: {
    fontFamily: "'Syne', sans-serif",
    fontWeight: 800,
    fontSize: 32,
    color: "#6366f1",
    letterSpacing: "-1px",
  },
  statLabel: { fontSize: 11, color: "rgba(232,234,240,0.4)", fontFamily: "'DM Mono', monospace", marginTop: 4 },
  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 },
  card: {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: 16,
    padding: "24px",
    marginBottom: 20,
  },
  cardTitle: {
    fontFamily: "'Syne', sans-serif",
    fontWeight: 700,
    fontSize: 16,
    color: "#e8eaf0",
    marginBottom: 20,
    letterSpacing: "-0.3px",
  },
  highYieldList: { display: "flex", flexDirection: "column", gap: 12 },
  highYieldItem: {
    display: "flex",
    alignItems: "center",
    gap: 16,
    background: "rgba(255,255,255,0.02)",
    borderRadius: 10,
    padding: "14px 16px",
    border: "1px solid rgba(255,255,255,0.05)",
  },
  hyRank: {
    fontFamily: "'Syne', sans-serif",
    fontWeight: 800,
    color: "#6366f1",
    fontSize: 18,
    minWidth: 36,
  },
  hyTopic: { fontFamily: "'Syne', sans-serif", fontWeight: 600, color: "#e8eaf0", fontSize: 14, marginBottom: 3 },
  hyReason: { fontSize: 11, color: "rgba(232,234,240,0.4)", fontFamily: "'DM Mono', monospace" },
  hyScore: { display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4, minWidth: 80 },
  hyScoreBar: {
    height: 4,
    background: "linear-gradient(90deg, #6366f1, #06b6d4)",
    borderRadius: 2,
    transition: "width 0.5s",
    alignSelf: "stretch",
  },
  hyScoreNum: { fontSize: 11, color: "#a5b4fc", fontFamily: "'DM Mono', monospace" },
  gapGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10 },
  gapItem: {
    border: "1px solid",
    borderRadius: 10,
    padding: "12px 14px",
    background: "rgba(255,255,255,0.02)",
  },
  gapRisk: (risk) => ({
    fontSize: 10,
    textTransform: "uppercase",
    letterSpacing: "0.8px",
    color: risk === "high" ? "#ef4444" : risk === "medium" ? "#f59e0b" : "#10b981",
    fontFamily: "'DM Mono', monospace",
    marginBottom: 4,
    fontWeight: 600,
  }),
  gapTopic: { fontSize: 13, color: "#e8eaf0", fontFamily: "'Syne', sans-serif", fontWeight: 600 },
  plannerList: { display: "flex", flexDirection: "column", gap: 12 },
  plannerItem: {
    background: "rgba(255,255,255,0.02)",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: 12,
    padding: "16px 18px",
  },
  plannerWeek: { display: "flex", alignItems: "center", gap: 10, marginBottom: 10 },
  plannerWeekNum: { fontFamily: "'Syne', sans-serif", fontWeight: 700, color: "#e8eaf0", fontSize: 15 },
  plannerPriority: {
    fontSize: 10,
    textTransform: "uppercase",
    letterSpacing: "0.6px",
    padding: "2px 10px",
    borderRadius: 20,
    fontFamily: "'DM Mono', monospace",
    fontWeight: 600,
  },
  plannerTopics: { display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 },
  topicTag: {
    background: "rgba(99,102,241,0.12)",
    border: "1px solid rgba(99,102,241,0.25)",
    borderRadius: 6,
    padding: "2px 10px",
    fontSize: 11,
    color: "#a5b4fc",
    fontFamily: "'DM Mono', monospace",
  },
  plannerMeta: { display: "flex", gap: 16, fontSize: 11, color: "rgba(232,234,240,0.4)", fontFamily: "'DM Mono', monospace" },
  plannerFocus: { color: "rgba(232,234,240,0.3)", fontStyle: "italic" },
  practiceList: { display: "flex", flexDirection: "column", gap: 12 },
  practiceItem: {
    background: "rgba(255,255,255,0.02)",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: 10,
    padding: "14px 16px",
  },
  practiceHeader: { display: "flex", alignItems: "center", gap: 8, marginBottom: 8 },
  practiceTag: {
    background: "rgba(6,182,212,0.12)",
    border: "1px solid rgba(6,182,212,0.25)",
    borderRadius: 6,
    padding: "2px 8px",
    fontSize: 10,
    color: "#67e8f9",
    fontFamily: "'DM Mono', monospace",
  },
  practiceDiff: (d) => ({
    fontSize: 10,
    color: d === "hard" ? "#ef4444" : d === "medium" ? "#f59e0b" : "#10b981",
    fontFamily: "'DM Mono', monospace",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    fontWeight: 600,
  }),
  practiceMarks: { fontSize: 10, color: "rgba(232,234,240,0.35)", fontFamily: "'DM Mono', monospace" },
  practiceQ: { fontSize: 13, color: "#c7cbe0", lineHeight: 1.6 },
  tipsList: { listStyle: "none", display: "flex", flexDirection: "column", gap: 10 },
  tipItem: {
    display: "flex",
    gap: 12,
    fontSize: 13,
    color: "rgba(232,234,240,0.7)",
    lineHeight: 1.6,
    fontFamily: "'DM Mono', monospace",
  },
  tipBullet: { color: "#6366f1", flexShrink: 0, fontWeight: 700 },
};
