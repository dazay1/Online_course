import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ExerciseRenderer from "../../components/ExerciseRender";
import AdminLayout from "../layout";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
export default function HomeworkDetail() {
  const { homeworkId } = useParams();
  const { userInfo } = useSelector((state) => state.userLogin);
  const studentId = userInfo?.id;
  const [data, setData] = useState(null);
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [coinsEarned, setCoinsEarned] = useState(0);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchHomework = async () => {
      try {
        const response = await fetch(
          `https://sql-server-nb7m.onrender.com/api/homework/detail/${homeworkId}`,
        );

        if (!response.ok) {
          console.error("Backend error:", response.status);
          return;
        }

        const jsonData = await response.json();
        setData(jsonData);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    if (homeworkId) {
      fetchHomework();
    }
  }, [homeworkId]);

  console.log(data)
  const submit = async (e) => {
    e.preventDefault();

    const payload = Object.entries(answers)
      .filter(([_, answer]) => answer !== "" && answer !== null)
      .map(([exercise_id, answer]) => ({
        exercise_id: Number(exercise_id),
        answer,
      }));

    if (!payload.length) {
      alert("Please answer at least one question.");
      return;
    }

    try {
      const response = await fetch(
        "https://sql-server-nb7m.onrender.com/api/homework/submit",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            student_id: studentId,
            homework_id: homeworkId,
            answers: payload,
          }),
        },
      );

      const result = await response.json();

      if (!result.success) {
        alert("Homework submission failed");
        return;
      }

      // ⭐ only call coins API after successful submission
      const coins = await fetch(
        "https://sql-server-nb7m.onrender.com/api/homework/coins/earned",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            student_id: studentId,
            homework_id: homeworkId,
            class_id: data.homework.class_id,
            given_by: data.homework.given_by,
          }),
        },
      );

      const coinsResult = await coins.json();

      console.log("Results:", result);
      console.log("Coins:", coinsResult);

      setResults(result.results || []);
      setIsSubmitted(true);
    } catch (error) {
      console.error("Submit error:", error);
    }
  };
  if (!data)
    return (
      <AdminLayout>
        <div className="p-10 text-center text-gray-500">
          Loading homework...
        </div>
      </AdminLayout>
    );
  const hasExercises = data.exercises && data.exercises.length > 0;
  const isTeacher = userInfo.role === "teacher";
  return (
    <AdminLayout hidden={true}>
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Homework Header */}
        <div
          className="rounded-3xl shadow-lg p-6 border-2 border-purple-100"
          style={{
            background: "linear-gradient(135deg, #fdf2ff, #eef2ff)",
          }}
        >
          <h2 className="text-3xl font-bold text-purple-700 mb-2">
            📚 {data.homework?.title}
          </h2>

          <p className="text-gray-600 mb-4">{data.homework?.description}</p>

          <div className="text-sm text-gray-500">
            ⏰ Deadline: {new Date(data.homework?.deadline).toLocaleString()}
          </div>
        </div>

        {/* Exercises */}
        {hasExercises && (
          <div className="space-y-6">
            {data.exercises.map((ex, index) => {
              const result = results.find(
                (r) => Number(r.exercise_id) === Number(ex.id),
              );

              return (
                <div
                  key={ex.id}
                  className="rounded-2xl border border-purple-100 shadow-md p-5 bg-white"
                >
                  <h4 className="font-bold text-lg mb-3">
                    Exercise {index + 1}
                  </h4>

                  <ExerciseRenderer
                    exercise={ex}
                    isSubmitted={isSubmitted}
                    result={result}
                    onChange={(val) =>
                      setAnswers((prev) => ({
                        ...prev,
                        [ex.id]: val,
                      }))
                    }
                  />
                </div>
              );
            })}
          </div>
        )}

        {/* Submit Button */}
        {!isSubmitted && !isTeacher && hasExercises && (
          <div className="text-center">
            <button
              onClick={submit}
              className="px-10 py-4 text-lg font-bold text-white rounded-full
            bg-gradient-to-r from-purple to-pink-500
            shadow-xl hover:scale-105 transform transition"
            >
              🚀 Submit Homework
            </button>
          </div>
        )}

        {/* After Submission */}
        {isSubmitted && (
          <div className="rounded-3xl p-6 text-center bg-green-50 border-2 border-green-200 shadow-md">
            <h3 className="text-2xl font-bold text-green-600 mb-3">
              🎉 Homework Submitted!
            </h3>

            <p className="text-gray-600 mb-5">
              Great job! Your answers have been checked.
            </p>

            <button
              onClick={() => navigate("/homework")}
              className="px-8 py-3 rounded-full font-bold text-white
            bg-gradient-to-r from-blue-500 to-indigo-600
            shadow-lg hover:scale-105 transition"
            >
              📚 Back to Homework
            </button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

const submitButtonStyle = {
  background: "linear-gradient(135deg, #ff7e5f, #feb47b)",
  color: "#fff",
  padding: "14px 40px",
  borderRadius: "40px",
  border: "none",
  fontSize: "17px",
  fontWeight: "bold",
  cursor: "pointer",
  boxShadow: "0 10px 25px rgba(255,126,95,0.4)",
  transition: "all 0.3s ease",
};

const successMessageStyle = {
  marginTop: "20px",
  padding: "15px",
  backgroundColor: "#e6f9f0",
  border: "2px solid #28a745",
  borderRadius: "12px",
  fontWeight: "bold",
  color: "#28a745",
};
