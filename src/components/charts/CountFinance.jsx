import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function CountFinance() {
  const [students, setStudents] = useState([]);
  const [data, setData] = useState([
    { name: "Avg", uv: 0, pv: 0, amt: 0 }, // Only keep Avg for August
  ]);

  useEffect(() => {
    const fetchStudents = async () => {
      const response = await fetch("http://localhost:5000/api/payment");
      const data = await response.json();
      // console.log(data)
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

      const getPaymentAmount = (monthName) => {
        if (monthName === "july") {
          const amounts = students
            .map((item) => {
              // Check if item.june is a valid string
              if (typeof item.july === "string") {
                // Replace "." with "" and "," with "." for proper float conversion
                return parseFloat(item.july.replace(".", "").replace(",", "."));
              }
              // If item.june is not a string, return 0 or handle it as needed
              return 0; // or return NaN, or any other default value
            })
            .filter((amount) => !isNaN(amount)); // Filter out NaN values
          // Sum the amounts
          const total = amounts.reduce(
            (total, currentAmount) => total + currentAmount,
            0
          );
          return total;
        } else if (monthName === "aug") {
          const amounts = students
            .map((item) => {
              // Check if item.june is a valid string
              if (typeof item.aug === "string") {
                // Replace "." with "" and "," with "." for proper float conversion
                return parseFloat(item.aug.replace(".", "").replace(",", "."));
              }
              // If item.june is not a string, return 0 or handle it as needed
              return 0; // or return NaN, or any other default value
            })
            .filter((amount) => !isNaN(amount)); // Filter out NaN values
          // Sum the amounts
          const total = amounts.reduce(
            (total, currentAmount) => total + currentAmount,
            0
          );
          return total;
        } else if (monthName === "sep") {
          const amounts = students
            .map((item) => {
              // Check if item.june is a valid string
              if (typeof item.sep === "string") {
                // Replace "." with "" and "," with "." for proper float conversion
                return parseFloat(item.sep.replace(".", "").replace(",", "."));
              }
              // If item.june is not a string, return 0 or handle it as needed
              return 0; // or return NaN, or any other default value
            })
            .filter((amount) => !isNaN(amount)); // Filter out NaN values
          // Sum the amounts
          const total = amounts.reduce(
            (total, currentAmount) => total + currentAmount,
            0
          );
          return total;
        }
        // Return 0 or another default value for other months
        return 0;
      };
      // console.log(students.map((item) => item.aug));

      // Update the data state with the sum of payments for August only
      setData([
        {
          name: "Iyul", // Only show Avg for August
          uv: getPaymentAmount("july"),
          pv: 0, // Set pv to 0 since we are not using it
          amt: 0,
        },
        {
          name: "Avg", // Only show Avg for August
          uv: getPaymentAmount("aug"),
          pv: 0, // Set pv to 0 since we are not using it
          amt: 0,
        },
        {
          name: "Sep", // Only show Avg for August
          uv: getPaymentAmount("sep"),
          pv: 0, // Set pv to 0 since we are not using it
          amt: 0,
        },
      ]);
    };
    fetchStudents();
  }, [students]);

  return (
    <div className="bg-white rounded-xl h-full p-4">
      <h1 className="text-lg font-semibold text-black">To'lov ro'yxati</h1>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          width={500}
          height={400}
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Area type="monotone" dataKey="uv" stroke="#8884d8" fill="#8884d8" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
