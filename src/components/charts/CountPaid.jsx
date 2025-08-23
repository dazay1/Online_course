import { useEffect, useState } from "react";
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

const CountPaid = () => {
  const [students, setStudents] = useState([]);
  const [data, setData] = useState([
    { name: "Iyul", uv: 0, pv: 0, amt: 0 },
    { name: "Avg", uv: 0, pv: 0, amt: 0 },
    { name: "Sent", uv: 0, pv: 0, amt: 0 },
  ]);

  useEffect(() => {
    const fetchStudents = async () => {
      const response = await fetch("http://localhost:5000/api/payment");
      const data = await response.json();
      setStudents(data);

      const june = students.filter(item => item.keldiAug === null);
      const aug = students.filter(item => item.ketdiJuly === null);
      const getPaymentDate = (monthName) => {
        if (monthName === "july") {
          const amounts = june
            .map((item) => {
              // Check if item.june is a valid string
              if (typeof item.july === "string") {
                // Replace "." with "" and "," with "." for proper float conversion
                return parseFloat(item.july.replace(".", "").replace(",", "."));
              }
              // If item.june is not a string, return 0 or handle it as needed
              return 0; // or return NaN, or any other default value
            })
            .filter((amount) => !isNaN(amount) && amount !== 0); // Filter out NaN values
          // Sum the amounts
          // console.log(amounts.filter(item => item === 0))
          return amounts;
        } else if (monthName === "aug") {
          const amounts = aug
            .map((item) => {
              // Check if item.june is a valid string
              if (typeof item.aug === "string") {
                // Replace "." with "" and "," with "." for proper float conversion
                return parseFloat(item.aug.replace(".", "").replace(",", "."));
              }
              // If item.june is not a string, return 0 or handle it as needed
              return 0; // or return NaN, or any other default value
            })
            .filter((amount) => !isNaN(amount) && amount !== 0); // Filter out NaN values
          return amounts;
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
            .filter((amount) => !isNaN(amount) && amount !== 0); // Filter out NaN values
          return amounts;
        }
        // Return 0 or another default value for other months
        return 0; // Filter by month
      };
      // Update the data state with the count of payments for August
      setData([
        {
          name: "Iyul",
          tolagan: getPaymentDate("july").length,
          tolamagan: june.length - getPaymentDate("july").length,
          amt: june.length,
        },
        {
          name: "Avg",
          tolagan: getPaymentDate("aug").length,
          tolamagan: aug.length - getPaymentDate("aug").length,
          amt: aug.length,
        },
        {
          name: "Sent",
          tolagan: getPaymentDate("sep").length,
          tolamagan: students.length - getPaymentDate("sep").length,
          amt: 2290,
        },
      ]);
    };
    fetchStudents();
  }, [data, students]);

  return (
    <div className="bg-white rounded-xl h-full p-4">
      <h1 className="text-lg font-semibold text-black">
        To'lov qilganlar ro'yxati
      </h1>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
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
    </div>
  );
};

export default CountPaid;
