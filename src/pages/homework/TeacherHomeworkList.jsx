import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import AdminLayout from "../layout";

export default function TeacherHomeworkList() {
  const { userInfo } = useSelector((state) => state.userLogin);
  const teacherId = userInfo?.id;

  const [homeworks, setHomeworks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeacherHomeworks = async () => {
      try {
        const response = await fetch(
          `https://sql-server-nb7m.onrender.com/api/teacher/homework/${teacherId}`
        );

        const data = await response.json();
        setHomeworks(data);
      } catch (error) {
        console.error("Error fetching teacher homeworks:", error);
      } finally {
        setLoading(false);
      }
    };

    if (teacherId) {
      fetchTeacherHomeworks();
    }
  }, [teacherId]);

  const isExpired = (deadline) => {
    return new Date(deadline) < new Date();
  };

  return (
    <AdminLayout>
      <div className="px-6 py-6 bg-gray-50 min-h-screen rounded-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            📚 My Created Homeworks
          </h2>

          <a
            href="/teacher/homework/create"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            + Create Homework
          </a>
        </div>

        {loading ? (
          <div className="text-center text-gray-500 mt-20">
            Loading homeworks...
          </div>
        ) : homeworks.length === 0 ? (
          <div className="text-center text-gray-500 mt-20">
            🎉 You haven't created any homework yet.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {homeworks.map((hw) => (
              <div
                key={hw.id}
                className="bg-white rounded-2xl shadow-md p-5 hover:shadow-xl transition duration-300 transform hover:-translate-y-1"
              >
                <h4 className="text-lg font-semibold text-gray-800 mb-2">
                  {hw.title}
                </h4>

                <p className="text-sm text-gray-500 mb-2">
                  📘 {hw.subject_name} | 🎓 {hw.level_name}
                </p>

                <p
                  className={`text-sm font-medium mb-3 ${
                    isExpired(hw.deadline)
                      ? "text-red-500"
                      : "text-gray-600"
                  }`}
                >
                  📅 Deadline: {new Date(hw.deadline).toLocaleDateString()}
                </p>

                <span
                  className={`inline-block px-3 py-1 text-sm rounded-full mb-4 ${
                    hw.is_published
                      ? "bg-green-100 text-green-600"
                      : "bg-yellow-100 text-yellow-600"
                  }`}
                >
                  {hw.is_published ? "Published" : "Draft"}
                </span>

                <div className="grid gap-2">
                  <a
                    href={`/teacher/homework/${hw.id}`}
                    className="block text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    Open
                  </a>
                  <a
                    href={`/teacher/homework/${hw.id}/submissions`}
                    className="block text-center bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-900 transition"
                  >
                    View Submissions
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
