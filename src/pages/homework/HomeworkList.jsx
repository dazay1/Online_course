import { useEffect, useState } from "react";
import AdminLayout from "../layout";
import { useSelector } from "react-redux";

export default function HomeworkList() {
  const { userInfo } = useSelector((state) => state.userLogin);
  const studentId = userInfo?.id;

  const [groupData, setGroupData] = useState([]);

  useEffect(() => {
    const fetchHomeworks = async () => {
      try {
        const group = await fetch(
          `https://sql-server-nb7m.onrender.com/api/homework/group/${userInfo?.classId}`,
        );
        const submitted = await fetch(
          `https://sql-server-nb7m.onrender.com/api/homework/submitted/${studentId}`,
        );
        
        const groupData = await group.json();
        const submittedData = await submitted.json();

        const submittedGroupData = groupData.map((hw) => {
          const submission = submittedData.find((s) => s.homework_id === hw.id);

          return {
            ...hw,
            status: submission?.status || "not_started",
            coins_earned: submission?.coins_earned || 0,
            submitted_at: submission?.submitted_at || null,
          };
        });

        setGroupData(submittedGroupData);
      } catch (error) {
        console.error("Error fetching homeworks:", error);
      }
    };

    if (studentId) {
      fetchHomeworks();
    }
  }, [studentId]);
  console.log(groupData)
  return (
    <AdminLayout hidden={true}>
      <div className="px-6 py-6 bg-white min-h-screen rounded-2xl">
        <h2 className="text-3xl font-bold text-purple-700 mb-8">
          📚 My Homework
        </h2>

        {groupData.length === 0 ? (
          <div className="text-center text-gray-500 py-12 rounded-xl bg-white shadow">
            🎉 No homework yet!
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {groupData.map((item) => {
              const isLocked =
                item.penalized ||
                (new Date(item.deadline) < new Date() &&
                  item.status !== "submitted");

              return (
                <div
                  key={item.id}
                  className="rounded-3xl shadow-lg p-6 border-2 border-purple-100 hover:shadow-2xl transition transform hover:-translate-y-2"
                  style={{
                    background: "linear-gradient(135deg, #fdf2ff, #eef2ff)",
                  }}
                >
                  {/* Title */}
                  <h4 className="text-xl font-bold text-gray-800 mb-2">
                    {item.title}
                  </h4>

                  {/* Description */}
                  <p className="text-gray-500 text-sm mb-4">
                    {item.description}
                  </p>

                  {/* Status */}
                  <span
                    className={`inline-block px-3 py-1 text-sm rounded-full mb-4 font-semibold ${
                      item.status === "submitted"
                        ? "bg-green-100 text-green-700"
                        : isLocked
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {item.status === "submitted"
                      ? "✅ Submitted"
                      : isLocked
                      ? "❌ Deadline Passed"
                      : "⏳ Not Started"}
                  </span>

                  {/* Coins */}
                  <div className="mb-4 bg-yellow-50 rounded-xl p-3 text-center border border-yellow-200">
                    <p
                      className={`font-bold text-lg ${
                        item.coins_earned < 0
                          ? "text-red-600"
                          : "text-yellow-700"
                      }`}
                    >
                      🪙 {item.coins_earned || 0} / {item.coins_reward}
                    </p>
                    <p className="text-xs text-gray-500">Coins Earned</p>
                  </div>

                  {/* Deadline */}
                  <div className="text-xs text-gray-500 mb-4">
                    ⏰ Deadline:{" "}
                    {new Date(item.deadline).toLocaleDateString()}
                  </div>

                  {/* Button */}
                  <a
                    href={isLocked ? "#" : `/homework/${item.id}`}
                    className={`block text-center py-3 px-6 rounded-3xl font-extrabold text-white text-lg shadow-2xl border-4 transition-all duration-300 ${
                      isLocked
                        ? "bg-gray-400 cursor-not-allowed pointer-events-none"
                        : "bg-[#8c00ff] hover:scale-110"
                    }`}
                  >
                    {isLocked
                      ? "❌ Locked"
                      : "🚀 Open Homework"}
                  </a>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
