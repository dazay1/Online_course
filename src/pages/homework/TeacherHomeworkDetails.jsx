import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AdminLayout from "../layout";

export default function TeacherHomeworkDetails() {
  const { id } = useParams();
  const [homework, setHomework] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomework = async () => {
      try {
        const res = await fetch(
          `https://sql-server-nb7m.onrender.com/api/homework/detail/${id}`
        );
        const subject = await fetch(
          `https://sql-server-nb7m.onrender.com/api/subjects`
        );
        const level = await fetch(
          `https://sql-server-nb7m.onrender.com/api/levels`
        );
        const subjectData = await subject.json();
        const levelData = await level.json();
        const data = await res.json();

        const subjects = subjectData.filter((sub) => sub.id === data.homework.subject_id);
        const levels = levelData.filter((level) => level.id === data.homework.level_id);
        setSubjects(subjects);
        setLevels(levels);
        setHomework(data.homework);
        setExercises(data.exercises || []);
      } catch (err) {
        console.error("Error loading homework", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomework();
  }, [id]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="text-center mt-20 text-gray-500">
          Loading homework...
        </div>
      </AdminLayout>
    );
  }

  if (!homework) {
    return (
      <AdminLayout>
        <div className="text-center mt-20 text-red-500">
          Homework not found.
        </div>
      </AdminLayout>
    );
  }
  console.log(homework);
  return (
    <AdminLayout>
      <div className="px-6 py-6 bg-gray-50 min-h-screen">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            📚 {homework.title}
          </h2>

          <div className="flex gap-3">
            <a
              href={`/teacher/homework/${id}/assign`}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
            >
              Assign Students
            </a>

            <a
              href={`/teacher/homework/${id}/exercises`}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
            >
              Add Exercises
            </a>

            <a
              href={`/teacher/homework/${id}/submissions`}
              className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900"
            >
              View Submissions
            </a>
          </div>
        </div>

        {/* HOMEWORK INFO */}
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Homework Information</h3>

          <p className="text-gray-600 mb-2">
            <strong>Description:</strong> {homework.description}
          </p>

          <p className="text-gray-600 mb-2">
            📘 Subject: {subjects[0]?.name}
          </p>

          <p className="text-gray-600 mb-2">
            🎓 Level: {levels[0]?.name}
          </p>

          <p className="text-gray-600">
            📅 Deadline:{" "}
            {new Date(homework.deadline).toLocaleDateString()}
          </p>
          <p className="text-gray-600">
            👨‍🎓 Given to: {homework.class_id}
          </p>
        </div>

        {/* EXERCISES */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-semibold mb-4">
            📝 Exercises ({exercises.length})
          </h3>

          {exercises.length === 0 ? (
            <div className="text-gray-500">
              No exercises added yet.
            </div>
          ) : (
            <div className="space-y-4">
              {exercises.map((ex, index) => (
                <div
                  key={ex.id}
                  className="border rounded-lg p-4 hover:bg-gray-50"
                >
                  <p className="font-medium">
                    {index + 1}. {ex.question}
                  </p>

                  <p className="text-sm text-gray-500 mt-1">
                    Points: {ex.points}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </AdminLayout>
  );
}