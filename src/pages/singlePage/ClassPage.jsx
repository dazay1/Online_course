"use client";
import { useEffect, useState, useMemo, useCallback } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { FaChartBar, FaUser } from "react-icons/fa";
import { MdRemoveRedEye, MdStars } from "react-icons/md";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import FormModal from "../../components/forms/FormModal";
import { Table } from "../../components";
import DatePick from "../../components/forms/DatePicker";
import AdminLayout from "../layout";
import { CgPlayListSearch } from "react-icons/cg";

// In-memory cache for API data
let cachedData = null;

const columns = [
  {
    header: "Student's Name",
    accessor: "studentName",
    className: "min-w-[200px]",
  },
  {
    header: "Phone",
    accessor: "Phone",
    className: "min-w-[140px]",
  },
  { header: "Actions", accessor: "actions", className: "min-w-[100px]" },
];

const Class = () => {
  const { id } = useParams();
  const { userInfo } = useSelector((state) => state.userLogin);
  const role = userInfo?.role;
  const [group, setGroup] = useState([]);
  const [teacher, setTeacher] = useState([]);
  const [selectedTab, setSelectedTab] = useState("");
  const [hoveredPhone, setHoveredPhone] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [status, setStatus] = useState({ isLoading: false, error: null });

  // Fetch data once on mount or when id changes
  useEffect(() => {
    const fetchGroup = async () => {
      if (cachedData) {
        const teachers = cachedData.filter(
          (item) => item.role === "teacher" && `${item.classId}` === `${id}`
        );
        setTeacher(teachers);
        setStatus({ isLoading: false, error: null });
        return;
      }

      setStatus({ isLoading: true, error: null });
      try {
        const response = await fetch(
          "https://sql-server-nb7m.onrender.com/api/group",
          {
            headers: { "Cache-Control": "no-cache" },
          }
        );
        if (!response.ok)
          throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        cachedData = data;
        const teachers = data.filter(
          (item) => item.role === "teacher" && `${item.classId}` === `${id}`
        );
        setTeacher(teachers);
        setStatus({ isLoading: false, error: null });
      } catch (error) {
        console.error("Error fetching group data:", error);
        setStatus({ isLoading: false, error: "Failed to load group data." });
      }
    };
    fetchGroup();
  }, [id]);

  // Update group data when selectedTab changes
  useEffect(() => {
    const students = cachedData?.filter(
      (item) =>
        item.name === selectedTab &&
        item.role === "student" &&
        item.ketdi === null
    );
    setGroup(students);
    console.log(group);
  }, [selectedTab]);

  // Memoized filtered students
  const filteredStudents = useMemo(() => {
    if (!searchQuery) return group;
    const query = searchQuery.toLowerCase();
    return group.filter((student) =>
      `${student.firstName} ${student.lastName}`.toLowerCase().includes(query)
    );
  }, [group, searchQuery]);

  // Memoized classes array
  const classesArray = useMemo(() => {
    const user = teacher[0] || {};
    if (userInfo.role === "admin" && typeof user.className === "string") {
      return user.className.split(", ").filter(Boolean);
    } else if (
      userInfo.role === "teacher" &&
      typeof userInfo.className === "string"
    ) {
      return userInfo.className.split(", ").filter(Boolean);
    }
    return Array.isArray(user.className) ? user.className : [];
  }, [teacher]);

  // Set initial tab when classesArray changes
  useEffect(() => {
    if (classesArray.length > 0 && !selectedTab) {
      setSelectedTab(classesArray[0]);
    }
  }, [classesArray, selectedTab]);

  // Memoized row rendering function
  const renderRow = useCallback(
    (item) => (
      <>
        <tr
          key={item.id}
          className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
        >
          <td className="flex items-center gap-4 p-4">
            {item.img ? (
              <img
                src={item.img}
                alt={`${item.firstName} ${item.lastName}`}
                width={40}
                height={40}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center text-white font-bold">
                {item.firstName.charAt(0)}
              </div>
            )}
            <div className="flex flex-col">
              <h3 className="font-semibold">
                {item.firstName} {item.lastName}
              </h3>
              <p className="text-xs text-gray-500">
                {item?.email || "No email"}
              </p>
            </div>
          </td>
          <td
            className=" relative"
            onMouseEnter={() => setHoveredPhone(item.id)}
            onMouseLeave={() => setHoveredPhone(null)}
          >
            {item.phone || "Not provided"}
            {hoveredPhone === item.id && (
              <div className="absolute top-full left-0 mt-1 bg-white p-2 rounded shadow-lg z-50 w-48">
                <p>Father: {item.fatherPhone || "Not provided"}</p>
                <p>Mother: {item.motherPhone || "Not provided"}</p>
              </div>
            )}
          </td>
          <td>
            <div className="flex items-center gap-2">
              <a
                href={`/students/${item.id}`}
                aria-label={`View details for ${item.firstName} ${item.lastName}`}
              >
                <button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaSky">
                  <MdRemoveRedEye />
                </button>
              </a>
              {role === "admin" && (
                <FormModal
                  table="studentGroup"
                  type="delete"
                  id={item.id}
                  tab={selectedTab}
                  firstName={item.firstName}
                  lastName={item.lastName}
                />
              )}
            </div>
          </td>
        </tr>
      </>
    ),
    [role, selectedTab, group, hoveredPhone]
  );

  return (
    <AdminLayout>
      <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0 width">
        {status.isLoading && (
          <p className="text-gray-500 text-center mt-4">Loading...</p>
        )}
        {status.error && (
          <p className="text-red-500 text-center mt-4">{status.error}</p>
        )}
        {!status.isLoading && !status.error && (
          <>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 p-2">
                {userInfo.img ? (
                  <img
                    src={
                      userInfo.role === "admin"
                        ? teacher[0]?.img || userInfo.img
                        : userInfo.img
                    }
                    alt="User"
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <FaUser className="w-12 h-12 rounded-full bg-sky-100 p-2 text-sky-600" />
                )}
                <div className="flex flex-col">
                  <h3 className="font-semibold">
                    {userInfo.role === "admin"
                      ? `${teacher[0]?.firstName || "Unknown"} ${
                          teacher[0]?.lastName || "Teacher"
                        }`
                      : `${userInfo.firstName} ${userInfo.lastName}`}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {userInfo.role === "admin"
                      ? teacher[0]?.email || "No email"
                      : userInfo.email}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <input
                    className="bg-transparent border border-gray-300 rounded-md focus:outline-none p-1 pl-8 w-24 md:w-48 focus:border-gray-500"
                    placeholder="Search students..."
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    aria-label="Search students"
                  />
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400">
                    <CgPlayListSearch size={20} />
                  </span>
                </div>
                {role === "admin" ? (
                  <>
                    <Link to={`/attendance/${id}`} aria-label="View attendance">
                      <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
                        <FaChartBar className="text-white text-[18px]" />
                      </button>
                    </Link>
                    <FormModal
                      table="studentGroup"
                      type="create"
                      data={selectedTab}
                    />
                  </>
                ) : (
                  <>
                    <Link to="/grade" aria-label="View attendance">
                      <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
                        <MdStars className="text-white text-[18px]" />
                      </button>
                    </Link>
                    <Link to="/attendance" aria-label="View attendance">
                      <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
                        <FaChartBar className="text-white text-[18px]" />
                      </button>
                    </Link>
                  </>
                )}
              </div>
            </div>
            {classesArray.length > 0 ? (
              <Tabs
                onSelect={(index) => setSelectedTab(classesArray[index] || "")}
              >
                <TabList className="flex overflow-x-auto whitespace-nowrap mb-4">
                  {classesArray.map((item, index) => (
                    <Tab
                      key={index}
                      className="px-4 py-2 cursor-pointer text-sm font-medium border-b-2 border-transparent hover:border-indigo-800 focus:outline-none"
                      selectedClassName="border-lamaSky text-indigo-800"
                    >
                      {item}
                    </Tab>
                  ))}
                </TabList>
                {classesArray.map((item, index) => (
                  <TabPanel key={index}>
                    <div className="overflow-x-auto max-w-full">
                      <Table
                        columns={columns}
                        renderRow={renderRow}
                        data={filteredStudents}
                      />
                    </div>
                  </TabPanel>
                ))}
              </Tabs>
            ) : (
              <p className="text-gray-500 text-center mt-4">
                No classes available.
              </p>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default Class;
