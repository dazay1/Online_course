import { useState } from "react";
import { useSelector } from "react-redux";
import AdminLayout from "../layout";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function CreateHomeworkWithExercises() {
  const userInfo = useSelector((state) => state.userLogin.userInfo);
  const [subjectsInput, setSubjectsInput] = useState([]);
  const [error, setError] = useState("");
  const [homework, setHomework] = useState({
    title: "",
    description: "",
    deadline: "",
    subject_id: "",
    level_id: "",
    given_by: userInfo?.id,
    coins_reward: 0,
  });
  const [availableClasses, setAvailableClasses] = useState([]);
  const [levels, setLevels] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [students, setStudents] = useState([]); // student IDs
  const [classes, setClasses] = useState([]); // class IDs
  const [assignType, setAssignType] = useState("student"); // "student" or "group"
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  // ================= API CALLS =================

  useEffect(() => {
    const fetchLevels = async () => {
      const res = await fetch(
        "https://sql-server-nb7m.onrender.com/api/levels",
      );
      const subjects = await fetch(
        "https://sql-server-nb7m.onrender.com/api/subjects",
      );
      const group = await fetch(
        `https://sql-server-nb7m.onrender.com/api/group`,
      );
      const data = await res.json();
      const groupData = await group.json();
      const subjectsData = await subjects.json();
      const teacherSubject = subjectsData.filter(
        (s) => s.name === userInfo.subject,
      );
      const teacherGroup = groupData.filter(
        (g) =>
          g.firstName === userInfo.firstName &&
          g.lastName === userInfo.lastName,
      );
      const classesArray =
        teacherGroup[0]?.className?.split(",").map((c) => c.trim()) || [];
      // filter by subject if needed
      const levelsFiltered = data.filter(
        (l) => l.subject_id === teacherSubject[0]?.id,
      );
      setAvailableClasses(classesArray);
      setSubjectsInput(teacherSubject[0]);
      setLevels(levelsFiltered);
    };

    fetchLevels();
  }, []);
  const createHomework = async () => {
    const homeworkToSend = {
      ...homework,
      subject_id: subjectsInput?.id,
      student_id: assignType === "student" ? students[0] : null,
      class_id: assignType === "group" ? classes[0] : null,
    };
    const res = await fetch(
      `https://sql-server-nb7m.onrender.com/api/teacher/homework`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(homeworkToSend),
      },
    );
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Failed to create homework");
    }
    return data.homework_id;
  };

  const addExercises = async (homework_id) => {
    if (!exercises.length) return;
    await fetch(
      `https://sql-server-nb7m.onrender.com/api/teacher/homework/${homework_id}/exercises`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ exercises }),
      },
    );
  };
  // console.log(assignType, students, classes);
  const assignHomework = async (homework_id) => {
    if (assignType === "student") {
      if (!students.length) return;
      await fetch(
        `https://sql-server-nb7m.onrender.com/api/teacher/homework/${homework_id}/assign`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ student_ids: students }),
        },
      );
    } else {
      if (!classes.length) return;
      await fetch(
        `https://sql-server-nb7m.onrender.com/api/teacher/homework/${homework_id}/assign/teacher`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ class_ids: classes }),
        },
      );
    }
  };

  const submitAll = async () => {
    if (!homework.title.trim()) {
      return setError("Title is required");
    }

    if (!homework.deadline) {
      return setError("Deadline is required");
    }

    if (!homework.level_id) {
      return setError("Please select a level");
    }

    if (assignType === "student" && students.length === 0) {
      return setError("Please enter at least one student ID");
    }

    if (assignType === "group" && classes.length === 0) {
      return setError("Please select at least one class");
    }

    setError(""); // clear previous error

    try {
      setLoading(true);
      const homework_id = await createHomework();
      await addExercises(homework_id);
      await assignHomework(homework_id);

      toast.success("✅ Homework created and assigned successfully!");
      setHomework({ ...homework, title: "", description: "", deadline: "" });
      setExercises([]);
      setStudents([]);
      setClasses([]);
      navigate("/teacher/homework");
    } catch (err) {
      console.error(err);
      toast.error("❌ Error creating homework.");
    } finally {
      setLoading(false);
    }
  };
  // ================= UI =================
  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50 px-6 py-8">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            📚 Create Homework
          </h2>

          {/* Homework Info */}
          <div className="grid gap-4 md:grid-cols-2 mb-8">
            <input
              className="input"
              placeholder="Title"
              value={homework.title}
              onChange={(e) =>
                setHomework({ ...homework, title: e.target.value })
              }
            />
            <input
              type="date"
              className="input"
              value={homework.deadline}
              onChange={(e) =>
                setHomework({ ...homework, deadline: e.target.value })
              }
            />
            <textarea
              className="input md:col-span-2"
              placeholder="Description"
              value={homework.description}
              onChange={(e) =>
                setHomework({ ...homework, description: e.target.value })
              }
            />
            <input
              className="input"
              value={subjectsInput?.name || ""}
              disabled
            />
            <select
              className="input"
              value={homework.level_id}
              onChange={(e) =>
                setHomework({
                  ...homework,
                  level_id: parseInt(e.target.value),
                })
              }
            >
              <option value="">Select Level</option>

              {levels.map((level) => (
                <option key={level.id} value={level.id}>
                  {level.name}
                </option>
              ))}
            </select>
            <input
              type="number"
              className="input"
              placeholder="Coins Reward"
              onChange={(e) =>
                setHomework({
                  ...homework,
                  coins_reward: parseInt(e.target.value),
                })
              }
            />
          </div>

          {/* Exercises Section */}
          <h3 className="text-xl font-semibold mb-4">📝 Exercises</h3>

          {exercises.map((ex, i) => (
            <div key={i} className="bg-gray-100 p-4 rounded-lg mb-4 space-y-4">
              {/* Question */}
              <input
                className="input"
                placeholder="Question"
                value={ex.question}
                onChange={(e) => {
                  const updated = [...exercises];
                  updated[i] = { ...updated[i], question: e.target.value };
                  setExercises(updated);
                }}
              />

              {/* Exercise Type */}
              <select
                className="input"
                value={ex.exercise_type_id}
                onChange={(e) => {
                  const type = parseInt(e.target.value);
                  const updated = [...exercises];

                  updated[i] = {
                    ...updated[i],
                    exercise_type_id: type,
                    data:
                      type === 1
                        ? { options: ["", ""], correctAnswerIndex: null }
                        : {},
                  };

                  setExercises(updated);
                }}
              >
                <option value={1}>MCQ</option>
                <option value={2}>Writing</option>
                <option value={3}>Coding</option>
              </select>

              {/* ================= MCQ UI ================= */}
              {ex.exercise_type_id === 1 && (
                <div className="space-y-3 bg-white p-3 rounded-lg">
                  <h4 className="font-medium">Options:</h4>

                  {ex.data?.options?.map((opt, optIndex) => (
                    <div key={optIndex} className="flex items-center gap-2">
                      <input
                        className="input flex-1"
                        placeholder={`Option ${optIndex + 1}`}
                        value={opt}
                        onChange={(e) => {
                          const updated = [...exercises];
                          const newOptions = [...updated[i].data.options];
                          newOptions[optIndex] = e.target.value;

                          updated[i] = {
                            ...updated[i],
                            data: {
                              ...updated[i].data,
                              options: newOptions,
                            },
                          };

                          setExercises(updated);
                        }}
                      />

                      <input
                        type="radio"
                        name={`correct-${i}`}
                        checked={ex.data.correctAnswerIndex === optIndex}
                        onChange={() => {
                          const updated = [...exercises];

                          updated[i] = {
                            ...updated[i],
                            data: {
                              ...updated[i].data,
                              correctAnswerIndex: optIndex,
                            },
                          };

                          setExercises(updated);
                        }}
                      />
                    </div>
                  ))}

                  <button
                    type="button"
                    className="text-blue-500 text-sm"
                    onClick={() => {
                      const updated = [...exercises];
                      const newOptions = [...updated[i].data.options, ""];
                      updated[i] = {
                        ...updated[i],
                        data: { ...updated[i].data, options: newOptions },
                      };
                      setExercises(updated);
                    }}
                  >
                    ➕ Add Option
                  </button>
                </div>
              )}

              {/* Writing Exercise Info */}
              {ex.exercise_type_id === 2 && (
                <div className="bg-white p-3 rounded-lg text-sm text-gray-500">
                  Student will submit a written answer.
                </div>
              )}

              {/* Coding Exercise Info */}
              {ex.exercise_type_id === 3 && (
                <div className="bg-white p-3 rounded-lg text-sm text-gray-500">
                  Student will submit code as an answer.
                </div>
              )}

              {/* Points */}
              <input
                type="number"
                className="input"
                placeholder="Points"
                value={ex.points}
                onChange={(e) => {
                  const updated = [...exercises];
                  updated[i] = {
                    ...updated[i],
                    points: parseInt(e.target.value) || 1,
                  };
                  setExercises(updated);
                }}
              />

              {/* Remove */}
              <button
                type="button"
                className="text-red-500 text-sm"
                onClick={() =>
                  setExercises(exercises.filter((_, idx) => idx !== i))
                }
              >
                Remove Exercise
              </button>
            </div>
          ))}
          <button
            type="button"
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition mb-8"
            onClick={() =>
              setExercises([
                ...exercises,
                {
                  question: "",
                  exercise_type_id: 1,
                  data: {
                    options: ["", ""],
                    correctAnswerIndex: null,
                  },
                  points: 1,
                  order_index: exercises.length,
                },
              ])
            }
          >
            ➕ Add Exercise
          </button>
          {/* Assignment Section */}
          <h3 className="text-xl font-semibold mb-4">👥 Assign Homework</h3>

          <div className="flex items-center space-x-4 mb-4">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="assignType"
                value="student"
                checked={assignType === "student"}
                onChange={() => setAssignType("student")}
              />
              <span>Specific Students</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="assignType"
                value="group"
                checked={assignType === "group"}
                onChange={() => setAssignType("group")}
              />
              <span>Whole Group/Class</span>
            </label>
          </div>

          {assignType === "student" ? (
            <input
              className="input mb-6"
              placeholder="Student IDs (comma separated)"
              value={students.join(",")}
              onChange={(e) => {
                const ids = e.target.value
                  .split(",")
                  .map((s) => parseInt(s.trim()))
                  .filter((n) => !isNaN(n));
                setStudents(ids);
              }}
            />
          ) : (
            <select
              multiple
              className="input mb-6"
              value={classes}
              onChange={(e) => {
                const selected = Array.from(e.target.selectedOptions).map(
                  (option) => option.value,
                );
                setClasses(selected);
              }}
            >
              {availableClasses.map((cls, index) => (
                <option key={index} value={cls}>
                  {cls}
                </option>
              ))}
            </select>
          )}
          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">
              {error}
            </div>
          )}
          <button
            onClick={submitAll}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition font-semibold"
          >
            {loading ? "Submitting..." : "🚀 Create & Assign Homework"}
          </button>
        </div>
      </div>

      <style>{`
        .input {
          width: 100%;
          padding: 10px;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          outline: none;
        }
        .input:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 2px rgba(59,130,246,0.2);
        }
      `}</style>
    </AdminLayout>
  );
}
