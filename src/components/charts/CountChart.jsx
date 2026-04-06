"use client";
import { RadialBarChart, RadialBar, ResponsiveContainer } from "recharts";
import maleFemale from "../../assets/maleFemale.png";
import { useEffect, useState, useMemo } from "react";

// In-memory cache for API data
let cachedData = null;

const CountChart = () => {
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
          headers: { "Cache-Control": "no-cache" }, // Avoid browser cache issues
        });
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        cachedData = data; // Cache the data
        setStudents(data);
        setStatus({ isLoading: false, error: null });
      } catch (error) {
        console.error("Error fetching student data:", error);
        setStatus({ isLoading: false, error: "Failed to load student data." });
      }
    };
    fetchStudents();
  }, []);

  // Memoize chart data to prevent recalculation
  const chartData = useMemo(() => {
    if (students.length === 0) {
      return [
        { name: "Total", count: 0, fill: "white" },
        { name: "Girls", count: 0, percent: 0, fill: "#fae27c" },
        { name: "Boys", count: 0, percent: 0, fill: "#c3ebfa" },
      ];
    }

    const activeStudents = students.filter((item) => item.ketdi === null);
    const totalCount = activeStudents.length;
    const boysCount = activeStudents.filter((student) => student.sex === "male").length;
    const girlsCount = totalCount - boysCount;
    const boysPercentage = totalCount > 0 ? Math.round((boysCount / totalCount) * 100) : 0;
    const girlsPercentage = totalCount > 0 ? Math.round((girlsCount / totalCount) * 100) : 0;

    return [
      { name: "Total", count: totalCount, fill: "white" },
      { name: "Girls", count: girlsCount, percent: girlsPercentage, fill: "#fae27c" },
      { name: "Boys", count: boysCount, percent: boysPercentage, fill: "#c3ebfa" },
    ];
  }, [students]);

  return (
    <div className="bg-white rounded-xl w-full h-full p-4">
      <h1 className="text-lg font-bold text-black">Students</h1>
      {status.isLoading && <p className="text-gray-500 text-center">Loading...</p>}
      {status.error && <p className="text-red-500 text-center">{status.error}</p>}
      {!status.isLoading && !status.error && (
        <>
          <div className="relative w-full h-[75%]">
            <ResponsiveContainer>
              <RadialBarChart
                cx="50%"
                cy="50%"
                innerRadius="40%"
                outerRadius="100%"
                barSize={32}
                data={chartData}
              >
                <RadialBar background dataKey="count" />
              </RadialBarChart>
            </ResponsiveContainer>
            <img
              src={maleFemale}
              alt="Male/Female Icon"
              width={40}
              height={40}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            />
          </div>
          <div className="flex justify-center gap-16">
            <div className="flex flex-col gap-1 items-center">
              <div className="w-5 h-5 bg-[#c3ebfa] rounded-full" />
              <h4 className="font-bold text-black">{chartData[2].count}</h4>
              <h5 className="text-xs text-gray-300">Boys ({chartData[2].percent}%)</h5>
            </div>
            <div className="flex flex-col gap-1 items-center">
              <div className="w-5 h-5 bg-[#fae27c] rounded-full" />
              <h4 className="font-bold text-black">{chartData[1].count}</h4>
              <h5 className="text-xs text-gray-300">Girls ({chartData[1].percent}%)</h5>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CountChart;