"use client";
import { useEffect, useState, useMemo } from "react";
import { toast } from "react-toastify";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// In-memory cache for API data
let cachedData = null;

const AttendanceChart = () => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [view, setView] = useState("weekly");
  const [status, setStatus] = useState({ isLoading: false, error: null });

  // Fetch data once on mount
  useEffect(() => {
    const fetchData = async () => {
      if (cachedData) {
        setAttendanceRecords(cachedData);
        setStatus({ isLoading: false, error: null });
        return;
      }

      setStatus({ isLoading: true, error: null });
      try {
        const response = await fetch("https://sql-server-nb7m.onrender.com/api/attendance", {
          headers: { "Cache-Control": "no-cache" },
        });
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        cachedData = data;
        setAttendanceRecords(data);
        setStatus({ isLoading: false, error: null });
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Error fetching data: " + error.message);
        setStatus({ isLoading: false, error: "Failed to load attendance data." });
      }
    };
    fetchData();
  }, []);

  // Memoized chart data based on view
  const chartData = useMemo(() => {
    if (attendanceRecords.length === 0) {
      return view === "monthly"
        ? Array.from({ length: 31 }, (_, i) => ({ name: `${i + 1}`, present: 0, absent: 0 }))
        : view === "yearly"
        ? Array.from({ length: 12 }, (_, i) => ({
            name: new Date(2025, i).toLocaleString("default", { month: "short" }),
            present: 0,
            absent: 0,
          }))
        : [
            { name: "Mon", present: 0, absent: 0 },
            { name: "Tue", present: 0, absent: 0 },
            { name: "Wed", present: 0, absent: 0 },
            { name: "Thu", present: 0, absent: 0 },
            { name: "Fri", present: 0, absent: 0 },
            { name: "Sat", present: 0, absent: 0 },
            { name: "Sun", present: 0, absent: 0 },
          ];
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to midnight

    if (view === "weekly") {
      const currentWeekStart = new Date(today);
      currentWeekStart.setDate(today.getDate() - today.getDay() + 1);
      currentWeekStart.setHours(0, 0, 0, 0);
      const currentWeekEnd = new Date(currentWeekStart);
      currentWeekEnd.setDate(currentWeekStart.getDate() + 6);
      currentWeekEnd.setHours(23, 59, 59, 999);

      const attendanceByWeek = {
        Mon: { present: 0, absent: 0 },
        Tue: { present: 0, absent: 0 },
        Wed: { present: 0, absent: 0 },
        Thu: { present: 0, absent: 0 },
        Fri: { present: 0, absent: 0 },
        Sat: { present: 0, absent: 0 },
        Sun: { present: 0, absent: 0 },
      };

      attendanceRecords.forEach((record) => {
        const date = new Date(record.attendance_date);
        date.setHours(0, 0, 0, 0);
        if (date >= currentWeekStart && date <= currentWeekEnd) {
          const dayName = date.toLocaleString("en-US", { weekday: "short" });
          attendanceByWeek[dayName][record.status] = (attendanceByWeek[dayName][record.status] || 0) + 1;
        }
      });

      return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => ({
        name: day,
        present: attendanceByWeek[day].present,
        absent: attendanceByWeek[day].absent,
      }));
    }

    if (view === "monthly") {
      const currentMonth = today.getMonth();
      const currentYear = today.getFullYear();
      const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
      const attendanceByMonth = Array.from({ length: daysInMonth }, () => ({
        present: 0,
        absent: 0,
      }));

      attendanceRecords.forEach((record) => {
        const date = new Date(record.attendance_date);
        if (date.getMonth() === currentMonth && date.getFullYear() === currentYear) {
          const day = date.getDate() - 1;
          attendanceByMonth[day][record.status] = (attendanceByMonth[day][record.status] || 0) + 1;
        }
      });

      return attendanceByMonth.map((data, index) => ({
        name: `${index + 1}`,
        present: data.present,
        absent: data.absent,
      }));
    }

    if (view === "yearly") {
      const currentYear = today.getFullYear();
      const attendanceByYear = Array.from({ length: 12 }, () => ({
        present: 0,
        absent: 0,
      }));

      attendanceRecords.forEach((record) => {
        const date = new Date(record.attendance_date);
        if (date.getFullYear() === currentYear) {
          const monthIndex = date.getMonth();
          attendanceByYear[monthIndex][record.status] = (attendanceByYear[monthIndex][record.status] || 0) + 1;
        }
      });

      return attendanceByYear.map((data, index) => ({
        name: new Date(currentYear, index).toLocaleString("default", { month: "short" }),
        present: data.present,
        absent: data.absent,
      }));
    }
  }, [attendanceRecords, view]);

  return (
    <div className="bg-white rounded-lg p-4 h-full">
      <div>
        <h1 className="text-lg font-semibold text-black">Attendance</h1>
        <div className="flex justify-between mt-3">
          <button
            onClick={() => setView("weekly")}
            className={`rounded px-4 py-2 mb-4 cursor-pointer ${view === "weekly" ? "bg-blue-600 text-white" : "bg-gray-200 text-black"}`}
          >
            Weekly
          </button>
          <button
            onClick={() => setView("monthly")}
            className={`rounded px-4 py-2 mb-4 cursor-pointer ${view === "monthly" ? "bg-blue-600 text-white" : "bg-gray-200 text-black"}`}
          >
            Monthly
          </button>
          <button
            onClick={() => setView("yearly")}
            className={`rounded px-4 py-2 mb-4 cursor-pointer ${view === "yearly" ? "bg-blue-600 text-white" : "bg-gray-200 text-black"}`}
          >
            Yearly
          </button>
        </div>
      </div>
      {status.isLoading && <p className="text-gray-500 text-center">Loading...</p>}
      {status.error && <p className="text-red-500 text-center">{status.error}</p>}
      {!status.isLoading && !status.error && (
        <ResponsiveContainer width="100%" height="80%">
          <BarChart data={chartData} barSize={20}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ddd" />
            <XAxis dataKey="name" axisLine={false} tick={{ fill: "#d1d5db" }} tickLine={false} />
            <YAxis tick={{ fill: "#d1d5db" }} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: "10px", borderColor: "lightgray" }} />
            <Legend align="left" verticalAlign="top" wrapperStyle={{ paddingTop: "20px", paddingBottom: "40px" }} />
            <Bar dataKey="present" fill="#fae27c" legendType="circle" radius={[10, 10, 0, 0]} />
            <Bar dataKey="absent" fill="#c3ebfa" legendType="circle" radius={[10, 10, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default AttendanceChart;