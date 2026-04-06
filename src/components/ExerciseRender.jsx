import { useEffect, useState } from "react";

function ExerciseRenderer({ exercise, onChange, isSubmitted, result }) {
  const [selected, setSelected] = useState(null);

  // Reset selection when exercise changes
  useEffect(() => {
    setSelected(null);
  }, [exercise?.id]);

  if (!exercise) return null;

  const data = exercise.data || {};

  return (
    <div
      style={{
        ...styles.card,
        ...(isSubmitted && result?.is_correct
          ? styles.correctCard
          : isSubmitted && !result?.is_correct
            ? styles.incorrectCard
            : {}),
      }}
    >
      <div style={styles.header}>
        <span style={styles.badge}>
          {exercise.type_key === "multiple_choice"
            ? "🎯 Question"
            : "✍️ Writing"}
        </span>
        <span style={styles.points}>{exercise.points} pts</span>
      </div>

      <h3 style={styles.question}>{exercise.question}</h3>

      {exercise.type_key === "multiple_choice" && (
        <div style={styles.optionsContainer}>
          {data.options?.map((opt, i) => {
            const isSelected = selected === i;

            return (
              <div
                key={i}
                onClick={() => {
                  if (isSubmitted) return; // lock selection
                  setSelected(i);
                  onChange(opt); // 🔑 send the **option string**
                }}
                style={{
                  ...styles.option,
                  ...(isSelected && styles.selectedOption),
                }}
              >
                {opt}
              </div>
            );
          })}
        </div>
      )}

      {exercise.type_key === "writing" && (
        <textarea
          placeholder="Write your answer here..."
          onChange={(e) => onChange(e.target.value)}
          style={styles.textarea}
          disabled={isSubmitted} // lock after submit
        />
      )}

      {isSubmitted && result && (
        <div
          style={{
            marginTop: "15px",
            fontWeight: "bold",
            color: result.is_correct ? "#28a745" : "#dc3545",
          }}
        >
          {result.is_correct ? "✔ Correct" : "✖ Incorrect"}
        </div>
      )}
    </div>
  );
}

const styles = {
  card: {
    background: "#f9fbff",
    padding: "25px",
    borderRadius: "18px",
    marginBottom: "25px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.06)",
    transition: "0.3s",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "10px",
  },
  badge: {
    background: "#e0e7ff",
    padding: "5px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "bold",
  },
  points: {
    fontSize: "12px",
    color: "#888",
  },
  question: {
    marginBottom: "18px",
    fontSize: "18px",
    fontWeight: "600",
  },
  optionsContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  option: {
    padding: "14px",
    borderRadius: "14px",
    cursor: "pointer",
    fontSize: "16px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    transition: "all 0.2s ease",
    backgroundColor: "#fff",
    border: "2px solid #eee",
  },
  selectedOption: {
    backgroundColor: "#6C63FF",
    color: "#fff",
    transform: "scale(1.03)",
    boxShadow: "0 6px 15px rgba(108,99,255,0.4)",
    border: "2px solid #6C63FF",
  },
  textarea: {
    width: "100%",
    minHeight: "120px",
    borderRadius: "14px",
    border: "2px solid #eee",
    padding: "12px",
    fontSize: "15px",
    resize: "none",
  },
  correctCard: {
    border: "2px solid #28a745",
    backgroundColor: "#eafaf1",
  },
  incorrectCard: {
    border: "2px solid #dc3545",
    backgroundColor: "#fdecea",
  },
};

export default ExerciseRenderer;
