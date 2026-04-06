import { useEffect, useState, useMemo } from "react";
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

// Cache to store fetched data (in-memory, persists during component lifecycle)
let cachedData = null;

const CountPaid = () => {
  const [students, setStudents] = useState([]);
  const [status, setStatus] = useState({ isLoading: false, error: null });

  // Memoized chart data to prevent recalculation
  const chartData = useMemo(() => {
    if (students.length === 0) {
      return [
        { name: "Iyul", tolagan: 0, tolamagan: 0, amt: 0 },
        { name: "Avg", tolagan: 0, tolamagan: 0, amt: 0 },
        { name: "Sent", tolagan: 0, tolamagan: 0, amt: 0 },
      ];
    }

    const parseDate = (dateStr) => {
      if (!dateStr || typeof dateStr !== "string") return null;
      const [day, month, year] = dateStr.split(".");
      if (!day || !month || !year) return null;
      const date = new Date(year, month - 1, day);
      return isNaN(date.getTime()) ? null : date;
    };

    const julyEnd = new Date(2025, 6, 31);
    const augEnd = new Date(2025, 7, 31);
    const sepEnd = new Date(2025, 8, 30);

    // Adjust field names based on your API (e.g., keldiJuly, ketdiJuly, etc.)
    const julyStudents = students.filter((student) => {
      const arrived = parseDate(student.keldiJuly || student.arrival);
      const departed = parseDate(student.ketdiJuly || student.departure);
      return (!arrived || arrived <= julyEnd) && (!departed || departed >= julyEnd);
    });

    const augStudents = students.filter((student) => {
      const arrived = parseDate(student.keldiAug || student.arrival);
      const departed = parseDate(student.ketdiAug || student.departure);
      return (!arrived || arrived <= augEnd) && (!departed || departed >= augEnd);
    });

    const sepStudents = students.filter((student) => {
      const arrived = parseDate(student.keldiSep || student.arrival);
      const departed = parseDate(student.ketdiSep || student.departure);
      return (!arrived || arrived <= sepEnd) && (!departed || departed >= sepEnd);
    });

    const getPaymentCount = (monthName, studentList) => {
      const monthField = { july: "july", aug: "aug", sep: "sep" }[monthName] || monthName;
      const paidCount = studentList.reduce((count, item) => {
        const value = item[monthField];
        if (typeof value === "string" && value.trim() !== "") {
          const parsed = parseFloat(value.replace(".", "").replace(",", "."));
          return !isNaN(parsed) && parsed !== 0 ? count + 1 : count;
        }
        return count;
      }, 0);
      return paidCount;
    };

    return [
      {
        name: "Iyul",
        tolagan: getPaymentCount("july", julyStudents),
        tolamagan: julyStudents.length - getPaymentCount("july", julyStudents),
        amt: julyStudents.length,
      },
      {
        name: "Avg",
        tolagan: getPaymentCount("aug", augStudents),
        tolamagan: augStudents.length - getPaymentCount("aug", augStudents),
        amt: augStudents.length,
      },
      {
        name: "Sent",
        tolagan: getPaymentCount("sep", sepStudents),
        tolamagan: sepStudents.length - getPaymentCount("sep", sepStudents),
        amt: sepStudents.length,
      },
    ];
  }, [students]);

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
          headers: { "Cache-Control": "no-cache" }, // Avoid browser cache issues
        });
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        cachedData = data; // Cache the data
        setStudents(data);
        setStatus({ isLoading: false, error: null });
      } catch (error) {
        console.error("Error fetching data:", error);
        setStatus({ isLoading: false, error: "Failed to load data." });
      }
    };
    fetchStudents();
  }, []);

  return (
    <div className="bg-white rounded-xl h-full p-4">
      <h1 className="text-lg font-semibold text-black">To'lov qilganlar ro'yxati</h1>
      {status.isLoading && <p className="text-gray-500">Loading...</p>}
      {status.error && <p className="text-red-500">{status.error}</p>}
      {!status.isLoading && !status.error && (
        <ResponsiveContainer width="100%" height="95%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="tolamagan" stackId="a" fill="#8884d8" />
            <Bar dataKey="tolagan" stackId="a" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default CountPaid;