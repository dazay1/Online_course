"use client";
import { useEffect, useState } from "react";
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

function AttendanceChart() {
  const [currentWeekData, setCurrentWeekData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [yearlyData, setYearlyData] = useState([]);
  const [view, setView] = useState("weekly"); // State to toggle between week, month, and year view

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/attendance");
        const attendanceRecords = await response.json();

        // Get today's date and calculate the start and end of the current week
        const today = new Date();
        const currentWeekStart = new Date(
          today.setDate(today.getDate() - today.getDay() + 1)
        );
        currentWeekStart.setHours(0, 0, 0, 0); // Normalize to midnight
        const currentWeekEnd = new Date(
          today.setDate(currentWeekStart.getDate() + 6)
        );
        currentWeekEnd.setHours(23, 59, 59, 999); // Normalize to end of the day

        // Initialize attendance objects for all days of the week
        const attendanceByCurrentWeek = {
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
          date.setHours(0, 0, 0, 0); // Normalize to midnight
          const dayName = date.toLocaleString("en-US", { weekday: "short" });

          // Check if the record is for the current week
          if (date >= currentWeekStart && date <= currentWeekEnd) {
            if (record.status === "present") {
              attendanceByCurrentWeek[dayName].present += 1;
            } else {
              attendanceByCurrentWeek[dayName].absent += 1;
            }
          }
        });

        // Define the order of the days of the week
        const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

        // Convert the attendanceByCurrentWeek object to an array for the chart in the correct order
        const currentWeekChartData = daysOfWeek.map((day) => ({
          name: day,
          present: attendanceByCurrentWeek[day].present,
          absent: attendanceByCurrentWeek[day].absent,
        }));

        setCurrentWeekData(currentWeekChartData);

        // Calculate monthly data for the current month
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();
        const attendanceByMonth = Array.from({ length: 31 }, () => ({
          present: 0,
          absent: 0,
        }));

        // Process attendance records to fill the attendanceByMonth object
        attendanceRecords.forEach((record) => {
          const date = new Date(record.attendance_date);
          if (date.getMonth() === currentMonth && date.getFullYear() === currentYear) {
            const day = date.getDate() - 1; // Adjust for zero-based index
            if (record.status === "present") {
              attendanceByMonth[day].present += 1;
            } else {
              attendanceByMonth[day].absent += 1;
            }
          }
        });

        // Convert the attendanceByMonth object to an array for the chart
        const monthlyChartData = attendanceByMonth.map((data, index) => ({
          name: `${index + 1}`, // Display day of the month
          present: data.present,
          absent: data.absent,
        }));

        setMonthlyData(monthlyChartData);

        // Calculate yearly data for all twelve months
        const attendanceByYear = Array.from({ length: 12 }, () => ({
          present: 0,
          absent: 0,
        }));

        attendanceRecords.forEach((record) => {
          const date = new Date(record.attendance_date);
          const monthIndex = date.getMonth();
          if (date.getFullYear() === currentYear) {
            if (record.status === "present") {
              attendanceByYear[monthIndex].present += 1;
            } else {
              attendanceByYear[monthIndex].absent += 1;
            }
          }
        });

        // Convert the attendanceByYear object to an array for the chart
        const yearlyChartData = attendanceByYear.map((data, index) => ({
          name: new Date(currentYear, index).toLocaleString("default", {
            month: "short",
          }),
          present: data.present,
          absent: data.absent,
        }));

        setYearlyData(yearlyChartData);
      } catch (error) {
        toast.error("Error fetching data: " + error);
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []); // No dependency on view

  const getChartData = () => {
    switch (view) {
      case "monthly":
        return monthlyData;
      case "yearly":
        return yearlyData;
      default:
        return currentWeekData;
    }
  };

  return (
    <div className="bg-white rounded-lg p-4 h-full">
      <div>
        <h1 className="text-lg font-semibold text-black">Attendance</h1>
        <div className="flex gap-1 mt-3">
          <button
            onClick={() => setView("weekly")}
            className="bg-blue-500 text-white rounded px-3 py-2 mb-4 cursor-pointer"
          >
            View Weekly
          </button>
          <button
            onClick={() => setView("monthly")}
            className="bg-blue-500 text-white rounded px-4 py-2 mb-4 cursor-pointer"
          >
            View Monthly
          </button>
          <button
            onClick={() => setView("yearly")}
            className="bg-blue-500 text-white rounded px-4 py-2 mb-4 cursor-pointer"
          >
            View Yearly
          </button>
        </div>
      </div>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart
          width={500}
          height={300}
          data={getChartData()}
          barSize={20}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ddd" />
          <XAxis
            dataKey="name"
            axisLine={false}
            tick={{ fill: "d1d5db" }}
            tickLine={false}
          />
          <YAxis tick={{ fill: "d1d5db" }} tickLine={false} />
          <Tooltip
            contentStyle={{ borderRadius: "10px", borderColor: "lightgray" }}
          />
          <Legend
            align="left"
            verticalAlign="top"
            wrapperStyle={{ paddingTop: "20px", paddingBottom: "40px" }}
          />
          <Bar
            dataKey="present"
            fill="#fae27c"
            legendType="circle"
            radius={[10, 10, 0, 0]}
          />
          <Bar
            dataKey="absent"
            fill="#c3ebfa"
            legendType="circle"
            radius={[10, 10, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default AttendanceChart;
