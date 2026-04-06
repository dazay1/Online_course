"use client";
import { useEffect, useState, useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// In-memory cache for API data
let cachedData = null;

const CountFinance = () => {
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
        const response = await fetch("https://sql-server-nb7m.onrender.com/api/payment", {
          headers: { "Cache-Control": "no-cache" },
        });
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        cachedData = data;
        setStudents(data);
        setStatus({ isLoading: false, error: null });
      } catch (error) {
        console.error("Error fetching payment data:", error);
        setStatus({ isLoading: false, error: "Failed to load payment data." });
      }
    };
    fetchStudents();
  }, []);

  // Memoized chart data
  const chartData = useMemo(() => {
    if (students.length === 0) {
      return [
        { name: "Iyul", uv: 0, pv: 0, amt: 0 },
        { name: "Avg", uv: 0, pv: 0, amt: 0 },
        { name: "Sent", uv: 0, pv: 0, amt: 0 },
      ];
    }

    const getPaymentAmount = (monthName) => {
      const monthField = { july: "july", aug: "aug", sep: "sep" }[monthName];
      if (!monthField) return 0;

      return students.reduce((total, item) => {
        const value = item[monthField];
        if (typeof value === "string" && value.trim() !== "") {
          const parsed = parseFloat(value.replace(".", "").replace(",", "."));
          return !isNaN(parsed) ? total + parsed : total;
        }
        return total;
      }, 0);
    };

    return [
      { name: "Iyul", uv: getPaymentAmount("july"), pv: 0, amt: 0 },
      { name: "Avg", uv: getPaymentAmount("aug"), pv: 0, amt: 0 },
      { name: "Sent", uv: getPaymentAmount("sep"), pv: 0, amt: 0 },
    ];
  }, [students]);

  return (
    <div className="bg-white rounded-xl h-full p-4">
      <h1 className="text-lg font-semibold text-black">To'lov ro'yxati</h1>
      {status.isLoading && <p className="text-gray-500 text-center">Loading...</p>}
      {status.error && <p className="text-red-500 text-center">{status.error}</p>}
      {!status.isLoading && !status.error && (
        <ResponsiveContainer width="100%" height="95%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
            <XAxis dataKey="name" tick={{ fill: "#d1d5db" }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fill: "#d1d5db" }} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={{ borderRadius: "10px", borderColor: "lightgray" }} />
            <Area type="monotone" dataKey="uv" stroke="#8884d8" fill="#8884d8" />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default CountFinance;