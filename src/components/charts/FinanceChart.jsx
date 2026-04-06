"use client";
import { useEffect, useState, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// In-memory cache for API data
let cachedData = null;

const FinanceChart = () => {
  const [students, setStudents] = useState([]);
  const [status, setStatus] = useState({ isLoading: false, error: null });

  // Fetch data once on mount
  useEffect(() => {
    const fetchStudents = async () => {
      if (cachedData) {
        setStudents(cachedData);
        setStatus({ isLoading: false, error: null });
        return;
      }

      setStatus({ isLoading: true, error: null });
      try {
        const response = await fetch("https://sql-server-nb7m.onrender.com/api/user", {
          headers: { "Cache-Control": "no-cache" },
        });
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        cachedData = data;
        setStudents(data);
        setStatus({ isLoading: false, error: null });
      } catch (error) {
        console.error("Error fetching student data:", error);
        setStatus({ isLoading: false, error: "Failed to load student data." });
      }
    };
    fetchStudents();
  }, []);

  // Memoized chart data
  const chartData = useMemo(() => {
    if (students.length === 0) {
      return [
        { name: "Iyul", keldi: 0, ketdi: 0, amt: 0 },
        { name: "Avg", keldi: 0, ketdi: 0, amt: 0 },
        { name: "Sent", keldi: 0, ketdi: 0, amt: 0 },
        { name: "Okt", keldi: 0, ketdi: 0, amt: 0 },
        { name: "Noy", keldi: 0, ketdi: 0, amt: 0 },
        { name: "Dek", keldi: 0, ketdi: 0, amt: 0 },
      ];
    }

    const parseDate = (dateStr) => {
      if (!dateStr || typeof dateStr !== "string") return null;
      const [day, month, year] = dateStr.split(".");
      if (!day || !month || !year) return null;
      return new Date(year, month - 1, day);
    };

    const monthToNumber = {
      July: "07",
      August: "08",
      September: "09",
      October: "10",
      November: "11",
      December: "12",
    };

    const countsByMonth = {
      July: { keldi: 0, ketdi: 0 },
      August: { keldi: 0, ketdi: 0 },
      September: { keldi: 0, ketdi: 0 },
      October: { keldi: 0, ketdi: 0 },
      November: { keldi: 0, ketdi: 0 },
      December: { keldi: 0, ketdi: 0 },
    };

    students.forEach((student) => {
      const keldiDate = parseDate(student.keldi);
      const ketdiDate = parseDate(student.ketdi);

      if (keldiDate) {
        const monthNum = (keldiDate.getMonth() + 1).toString().padStart(2, "0");
        const monthName = Object.keys(monthToNumber).find(
          (key) => monthToNumber[key] === monthNum
        );
        if (monthName) countsByMonth[monthName].keldi += 1;
      }

      if (ketdiDate) {
        const monthNum = (ketdiDate.getMonth() + 1).toString().padStart(2, "0");
        const monthName = Object.keys(monthToNumber).find(
          (key) => monthToNumber[key] === monthNum
        );
        if (monthName) countsByMonth[monthName].ketdi += 1;
      }
    });

    const totalCount = students.filter((item) => item.keldi !== null || item.ketdi !== null).length;

    return [
      { name: "Iyul", keldi: countsByMonth.July.keldi, ketdi: countsByMonth.July.ketdi, amt: totalCount },
      { name: "Avg", keldi: countsByMonth.August.keldi, ketdi: countsByMonth.August.ketdi, amt: totalCount },
      { name: "Sent", keldi: countsByMonth.September.keldi, ketdi: countsByMonth.September.ketdi, amt: totalCount },
      { name: "Okt", keldi: countsByMonth.October.keldi, ketdi: countsByMonth.October.ketdi, amt: totalCount },
      { name: "Noy", keldi: countsByMonth.November.keldi, ketdi: countsByMonth.November.ketdi, amt: totalCount },
      { name: "Dek", keldi: countsByMonth.December.keldi, ketdi: countsByMonth.December.ketdi, amt: totalCount },
    ];
  }, [students]);

  return (
    <div className="bg-white rounded-xl h-full p-4">
      <h1 className="text-lg font-semibold text-black">Students</h1>
      {status.isLoading && <p className="text-gray-500 text-center">Loading...</p>}
      {status.error && <p className="text-red-500 text-center">{status.error}</p>}
      {!status.isLoading && !status.error && (
        <ResponsiveContainer width="100%" height="90%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
            <XAxis
              dataKey="name"
              axisLine={false}
              tick={{ fill: "#d1d5db" }}
              tickLine={false}
              tickMargin={10}
            />
            <YAxis axisLine={false} tick={{ fill: "#d1d5db" }} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: "10px", borderColor: "lightgray" }} />
            <Legend
              align="center"
              verticalAlign="top"
              wrapperStyle={{ paddingTop: "10px", paddingBottom: "30px" }}
            />
            <Line
              type="monotone"
              dataKey="keldi"
              stroke="#c3ebfa"
              strokeWidth={5}
              name="Arrived"
            />
            <Line
              type="monotone"
              dataKey="ketdi"
              stroke="#fae27c"
              strokeWidth={5}
              name="Left"
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default FinanceChart;