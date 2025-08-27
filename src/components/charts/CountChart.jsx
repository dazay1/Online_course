"use client";
import { RadialBarChart, RadialBar, ResponsiveContainer } from "recharts";
import maleFemale from "../../assets/maleFemale.png";
import { useEffect, useState } from "react";

const CountChart = () => {
  const [data, setData] = useState([
    {
      name: "Total",
      count: 0,
      fill: "white",
    },
    {
      name: "Girls",
      count: 0,
      fill: "#fae27c",
    },
    {
      name: "Boys",
      count: 0,
      fill: "#c3ebfa",
    },
  ]);
  useEffect(() => {
    const totalStudent = async () => {
      try {
        const response = await fetch(
          "https://sql-server-nb7m.onrender.com/api/user"
        );
        const data = await response.json();
        // Calculate counts

        const left = data.filter((item) => item.ketdi !== null);
        const userCount = data.length - left.length;
        const totalCount = userCount;
        const boysCount = data.filter(
          (student) => student.sex === "male" && student.ketdi === null
        ).length; // Assuming gender is a property
        const boysPercentage = (boysCount / totalCount) * 100;
        const boysRountedPercentage = boysPercentage.toFixed(0);
        const girlsCount = totalCount - boysCount; // Calculate girls count
        const girlsPercentage = (girlsCount / totalCount) * 100;
        const girslRountedPercentage = girlsPercentage.toFixed(0);
        // Update the data state
        setData([
          {
            name: "Total",
            count: totalCount,
            fill: "white",
          },
          {
            name: "Girls",
            count: girlsCount,
            percent: girslRountedPercentage,
            fill: "#fae27c",
          },
          {
            name: "Boys",
            count: boysCount,
            percent: boysRountedPercentage,
            fill: "#c3ebfa",
          },
        ]);
      } catch (error) {
        console.error("Error fetching student data:", error);
      }
    };
    totalStudent();
  }, [data]);
  return (
    <div className="bg-white rounded-xl w-full h-full p-4">
      {/* TITLE */}
      <h1 className="text-lg font-bold text-black">Students</h1>
      {/* CHART */}
      <div className="relative w-full h-[75%]">
        <ResponsiveContainer>
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="40%"
            outerRadius="100%"
            barSize={32}
            data={data}
          >
            <RadialBar background dataKey="count" />
          </RadialBarChart>
        </ResponsiveContainer>
        <img
          src={maleFemale}
          alt=""
          width={40}
          height={40}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 "
        />{" "}
      </div>
      {/* BOTTOM */}
      <div className="flex justify-center gap-16">
        <div className="flex flex-col gap-1">
          <div className="w-5 h-5 bg-lamaSky rounded-full" />
          <h4 className="font-bold text-black">{data[2].count}</h4>
          <h5 className="text-xs text-gray-300">Boys ({data[2].percent}%)</h5>
        </div>
        <div className="flex flex-col gap-1">
          <div className="w-5 h-5 bg-lamaYellow rounded-full" />
          <h4 className="font-bold text-black">{data[1].count}</h4>
          <h5 className="text-xs text-gray-300">Girls ({data[1].percent}%)</h5>
        </div>
      </div>
    </div>
  );
};
export default CountChart;
