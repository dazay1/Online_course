"use client";

import { useEffect, useState } from "react";
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

const FinanceChart = () => {
  const [students, setStudents] = useState([]);
  const [data, setData] = useState([
    {
      name: "Iyul",
      income: 0,
      expense: 0,
      amt: 0,
    },
    {
      name: "Avg",
      ketdi: 0,
      keldi: 0,
      amt: 0,
    },
    {
      name: "Sent",
      income: 0,
      expense: 0,
      amt: 0,
    },
    {
      name: "Okt",
      income: 0,
      expense: 0,
      amt: 0,
    },
    {
      name: "Noy",
      income: 0,
      expense: 0,
      amt: 0,
    },
    {
      name: "Dek",
      income: 0,
      expense: 0,
      amt: 0,
    },
  ]);
  useEffect(() => {
    const fetchStudents = async () => {
      const response = await fetch("http://localhost:5000/api/user");
      const data = await response.json();
      setStudents(data);

      const monthToNumber = {
        January: "01",
        February: "02",
        March: "03",
        April: "04",
        May: "05",
        June: "06",
        July: "07",
        August: "08",
        September: "09",
        October: "10",
        November: "11",
        December: "12",
      };
      const ketdi = students
          .filter((item) => item.ketdi !== null)
          .map((item) => item.ketdi);
      const keldi = students.filter((item) => item.keldi !== null).map((item) => item.keldi);
      const totalCount = ketdi.length + keldi.length;
      const getDatesByLeft = (monthName) => {
        const monthNumber = monthToNumber[monthName];
        if (!monthNumber) {
          return []; // Return an empty array if the month name is invalid
        }
        // Filter the dates based on the month number
        return ketdi.filter((date) => date.split(".")[1] === monthNumber);
      };
      const getDatesByCome = (monthName) => {
        const monthNumber = monthToNumber[monthName];
        if (!monthNumber) {
          return []; // Return an empty array if the month name is invalid
        }
        // Filter the dates based on the month number
        return keldi.filter((date) => date.split(".")[1] === monthNumber);
      };
      // Example usage
      setData([
        {
          name: 'Iyul',
          ketdi: getDatesByLeft('June') ? getDatesByLeft('June').length : '',
          keldi: getDatesByCome('June') ? getDatesByCome('June').length : '',
          amt: totalCount
        },
        {
          name: 'Avg',
          ketdi: getDatesByLeft('August') ? getDatesByLeft('August').length : '',
          keldi: getDatesByCome('August') ? getDatesByCome('August').length : '',
          amt: totalCount
        }
      ])
    };
    fetchStudents();
  }, [data]);

  return (
    <div className="bg-white rounded-xl h-full p-4">
      {/* TITLE */}
      <h1 className="text-lg font-semibold text-black">Students</h1>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
          <XAxis
            dataKey="name"
            axisLine={false}
            tick={{ fill: "d1d5db" }}
            tickLine={false}
            tickMargin={10}
          />
          <YAxis axisLine={false} tick={{ fill: "d1d5db" }} tickLine={false} />
          <Tooltip />
          <Legend
            align="center"
            verticalAlign="top"
            wrapperStyle={{ paddingTop: "10px", paddingBottom: "30px" }}
          />
          <Line
            type="monotone"
            dataKey="ketdi"
            stroke="#fae27c"
            strokeWidth={5}
          />
          <Line
            type="monotone"
            dataKey="keldi"
            stroke="#c3ebfa"
            strokeWidth={5}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FinanceChart;
