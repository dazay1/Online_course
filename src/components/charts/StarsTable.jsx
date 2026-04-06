// ./charts/StarsTable.jsx
import { useEffect, useState } from "react";
import {
  FaEdit,
  FaChevronLeft,
  FaChevronRight,
  FaDownload,
} from "react-icons/fa";
import { toast } from "react-toastify";

const API = "https://sql-server-nb7m.onrender.com/api";

export default function StarsTable({ selectedClass, teacherId }) {
  const [students, setStudents] = useState([]);
  const [lessonDates, setLessonDates] = useState([]);
  const [starsByLesson, setStarsByLesson] = useState({});
  const [editing, setEditing] = useState(null); // {studentId, date, not_late, actives, homework, id}
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [teacher, setTeacher] = useState([]);
  /* ------------------------------------------------- LOAD ------------------------------------------------- */
  useEffect(() => {
    const load = async () => {
      try {
        const [starsRes, groupRes, usersRes] = await Promise.all([
          fetch(`${API}/stars`),
          fetch(`${API}/group`),
          fetch(`${API}/user`),
        ]);

        const starsData = await starsRes.json();
        const groupData = await groupRes.json();

        const teacher = groupData.find((i) => i.id === teacherId);
        setTeacher(teacher);
        const classInfo = groupData.find((g) => g.name === selectedClass);
        if (!classInfo) return toast.error("Class not found");
        const classId = classInfo.classId;

        const allStudents = groupData
          .filter(
            (i) =>
              i.role === "student" &&
              i.name === selectedClass &&
              i.ketdi === null
          )
          .map((s) => ({
            id: s.id,
            firstName: s.firstName,
            lastName: s.lastName,
            img: s.img || null,
          }));
        setStudents(allStudents);
        const daysString =
          groupData.find((i) => i.name === selectedClass)?.day || "";
        const lessonDays = convertDaysStringToArray(daysString);

        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const dates = [];

        const first = new Date(year, month, 1);
        const last = new Date(year, month + 1, 0);

        for (let d = first.getDate(); d <= last.getDate(); d++) {
          const date = new Date(year, month, d);
          if (lessonDays.includes(date.getDay())) {
            // Format as YYYY-MM-DD to match your DB format
            const yyyy = date.getFullYear();
            const mm = String(date.getMonth() + 1).padStart(2, "0");
            const dd = String(date.getDate()).padStart(2, "0");
            dates.push(`${yyyy}-${mm}-${dd}`);
          }
        }
        setLessonDates(dates);

        const map = {};
        allStudents.forEach((st) => {
          map[st.id] = {};
          dates.forEach(
            (d) => (map[st.id][d] = { not_late: 0, actives: 0, homework: 0 })
          );
        });
        starsData
          .filter((s) => s.class_id === classId && s.given_by === teacherId)
          .forEach((rec) => {
            const dateStr = new Date(rec.lesson_date).toLocaleDateString(
              "en-GB"
            );
            if (map[rec.student_id] && dates.includes(rec.lesson_date)) {
              map[rec.student_id][rec.lesson_date] = {
                not_late: rec.not_late,
                actives: rec.actives,
                homework: rec.homework,
                id: rec.id,
              };
            }
          });
        setStarsByLesson(map);
      } catch (e) {
        console.error(e);
        toast.error("Failed to load data");
      }
    };

    if (selectedClass && teacherId) load();
  }, [selectedClass, teacherId, currentMonth]);
  /* ------------------------------------------------- HELPERS ------------------------------------------------- */
  const convertDaysStringToArray = (str) => {
    const map = { Mon: 1, Tue: 2, Wed: 3, Thurs: 4, Fri: 5, Sat: 6, Sun: 0 };
    return str
      .split(", ")
      .map((d) => map[d.trim()])
      .filter(Boolean);
  };

  const totalForStudent = (studentId) => {
    return Object.values(starsByLesson[studentId] || {}).reduce(
      (s, v) => s + v.not_late + v.actives + v.homework,
      0
    );
  };

  const saveStars = async () => {
    if (!editing) return;
    const { studentId, date, not_late, actives, homework, id, given_by } =
      editing;

    try {
      const userId = editing.id != null
      const method = userId ? "PUT" : "POST";
      const endpoint = userId ? `${API}/star/put` : `${API}/star/post`
      const createStar = await fetch(endpoint, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing),
      });
      console.log(createStar)
      if (!createStar.ok) {
        throw new Error("Server error please try again");
      } else {
        toast.success("Saved!");
        setEditing(null);
      }
    } catch {
      toast.error("Save failed");
    }
  };

  const exportCSV = () => {
    const headers = ["Student", "ID", ...lessonDates, "Total"];
    const rows = students.map((st) => {
      const row = [`${st.firstName} ${st.lastName}`, st.id];
      lessonDates.forEach((d) => {
        const c = starsByLesson[st.id]?.[d] || {};
        row.push(c.not_late + c.actives + c.homework);
      });
      row.push(totalForStudent(st.id));
      return row.join(",");
    });

    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${selectedClass}_stars_${currentMonth.toLocaleDateString(
      "en-GB",
      { month: "short", year: "numeric" }
    )}.csv`;
    a.click();
  };

  const monthName = currentMonth.toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });

  /* ------------------------------------------------- RENDER ------------------------------------------------- */
  return (
    <div className="p-4 bg-gray-50 min-h-screen ">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-lg shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() =>
              setCurrentMonth(
                new Date(
                  currentMonth.getFullYear(),
                  currentMonth.getMonth() - 1
                )
              )
            }
            className="p-2 hover:bg-gray-100 rounded"
          >
            <FaChevronLeft />
          </button>
          <h2 className="text-xl font-bold text-gray-800">{monthName}</h2>
          <button
            onClick={() =>
              setCurrentMonth(
                new Date(
                  currentMonth.getFullYear(),
                  currentMonth.getMonth() + 1
                )
              )
            }
            className="p-2 hover:bg-gray-100 rounded"
          >
            <FaChevronRight />
          </button>
        </div>
        <button
          onClick={exportCSV}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          <FaDownload /> Export CSV
        </button>
      </div>
      {/* Student Cards */}
      <div className="">
        {students.map((st) => {
          const monthTotal = totalForStudent(st.id);
          const maxMonth = lessonDates.length * 50;

          return (
            <div
              key={st.id}
              className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition"
            >
              {/* Student header */}
              <div className="flex items-center justify-between mb-3 ">
                <div className="flex items-center gap-3">
                  {st.img ? (
                    <img
                      src={st.img}
                      alt=""
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                      {st.firstName[0]}
                    </div>
                  )}
                  <div>
                    <div className="font-semibold text-lg">
                      {st.firstName} {st.lastName}
                    </div>
                  </div>
                </div>

                {/* Monthly total + progress */}
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">
                    {monthTotal}
                  </div>
                  <div className="text-xs text-gray-500">{maxMonth} max</div>
                  <div className="w-32 h-2 bg-gray-200 rounded-full mt-1 overflow-hidden">
                    <div
                      className="h-full bg-green-500 transition-all"
                      style={{ width: `${(monthTotal / maxMonth) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Lesson timeline */}
              <div className="flex gap-2 overflow-x-auto pb-2 width2">
                {lessonDates.map((date) => {
                  const cell = starsByLesson[st.id]?.[date] || {
                    not_late: 0,
                    actives: 0,
                    homework: 0,
                  };
                  const sum = cell.not_late + cell.actives + cell.homework;
                  return (
                    <div
                      key={date}
                      className="flex-shrink-0 w-20 text-center cursor-pointer group"
                      onClick={() =>
                        setEditing({
                          studentId: st.id,
                          date,
                          classId: st.classId,
                          given_by: teacher.id,
                          classId: teacher.classId,
                          ...cell,
                        })
                      }
                    >
                      <div className="p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                        {/* 3 categories */}
                        <div className="grid grid-cols-3 gap-1 text-xs">
                          <div className="font-medium text-green-600">
                            {cell.not_late}
                          </div>
                          <div className="font-medium text-blue-600">
                            {cell.actives}
                          </div>
                          <div className="font-medium text-purple-600">
                            {cell.homework}
                          </div>
                        </div>
                        {/* lesson total */}
                        <div className="mt-1 font-bold text-sm">{sum}</div>
                        {/* edit hint */}
                        <div className="text-xs text-gray-500 opacity-0 group-hover:opacity-100">
                          Edit
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* ---------- EDIT MODAL (your exact code) ---------- */}
      {editing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="text-lg font-bold mb-4">
              Edit –{" "}
              {students.find((s) => s.id === editing.studentId)?.firstName}
              {editing.date && ` (${editing.date})`}
            </h3>
            <div className="space-y-4">
              <Slider
                label="Not Late (0-10)"
                value={editing.not_late}
                max={10}
                onChange={(v) => setEditing((e) => ({ ...e, not_late: v }))}
              />
              <Slider
                label="Active (0-15)"
                value={editing.actives}
                max={15}
                onChange={(v) => setEditing((e) => ({ ...e, actives: v }))}
              />
              <Slider
                label="Homework (0-25)"
                value={editing.homework}
                max={25}
                onChange={(v) => setEditing((e) => ({ ...e, homework: v }))}
              />
            </div>
            <div className="mt-4 text-center font-bold text-lg">
              Total:{" "}
              {(editing.not_late || 0) +
                (editing.actives || 0) +
                (editing.homework || 0)}{" "}
              / 50
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setEditing(null)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={saveStars}
                className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------- COMPONENTS ------------------------------------------------- */
function Slider({ label, value, max, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        type="range"
        min="0"
        max={max}
        value={value}
        onChange={(e) => onChange(+e.target.value)}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-yellow-500"
      />
      <div className="flex justify-between text-xs text-gray-600 mt-1">
        <span>0</span>
        <span className="font-bold">{value}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}
