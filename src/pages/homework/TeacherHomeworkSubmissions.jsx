import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AdminLayout from "../layout";

export default function TeacherHomeworkSubmissions() {
  const { id } = useParams();

  const [submissions, setSubmissions] = useState([]);
  const [homework, setHomework] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const res = await fetch(
          `https://sql-server-nb7m.onrender.com/api/homework/submission`
        );
        const students = await fetch(
          `https://sql-server-nb7m.onrender.com/api/user`
        );
        const studentData = await students.json();
        const data = await res.json();
        const homeworkData = data.filter((hw) => hw.homework_id === Number(id));
        const mergedData = homeworkData.map((sub) => {
          const student = studentData.find((s) => s.id === sub.student_id);
          return {
            ...sub,
            firstName: student ? student.firstName : "Unknown",
            lastName: student ? student.lastName : "Student",
          };
        });
        if (mergedData) {
          setSubmissions(mergedData);
        }
      } catch (err) {
        console.error("Error loading submissions", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [id]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="text-center mt-20 text-gray-500">
          Loading submissions...
        </div>
      </AdminLayout>
    );
  }
  return (
    <AdminLayout>
      <div className="px-6 py-6 bg-gray-50 min-h-screen">

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            📊 Homework Submissions
          </h2>

          <a
            href={`/teacher/homework/${id}`}
            className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900"
          >
            ← Back to Homework
          </a>
        </div>

        {homework && (
          <div className="bg-white rounded-xl shadow p-6 mb-6">
            <h3 className="text-lg font-semibold mb-2">
              {homework.title}
            </h3>

            <p className="text-gray-600">
              📅 Deadline: {new Date(homework.deadline).toLocaleDateString()}
            </p>
          </div>
        )}

        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-left">

            <thead className="bg-gray-100">
              <tr>
                <th className="p-4">Student</th>
                <th>Status</th>
                <th>Submitted At</th>
                <th>Score</th>
                <th></th>
              </tr>
            </thead>

            <tbody>

              {submissions.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center p-6 text-gray-500">
                    No submissions yet.
                  </td>
                </tr>
              ) : (
                submissions.map((sub) => (
                  <tr key={sub.id} className="border-t hover:bg-gray-50">

                    <td className="p-4">
                      {sub.firstName} {sub.lastName}
                    </td>

                    <td>
                      {sub.submitted_at ? (
                        <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm">
                          Submitted
                        </span>
                      ) : (
                        <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm">
                          Not Submitted
                        </span>
                      )}
                    </td>

                    <td>
                      {sub.submitted_at
                        ? new Date(sub.submitted_at).toLocaleString()
                        : "-"}
                    </td>

                    <td>
                      {sub.coins_earned !== null ? `${sub.coins_earned} coins` : "-"}
                    </td>

                    <td>
                      {sub.submitted_at && (
                        <a
                          href={`/teacher/submission/${sub.id}`}
                          className="text-blue-600 hover:underline"
                        >
                          View
                        </a>
                      )}
                    </td>

                  </tr>
                ))
              )}

            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}