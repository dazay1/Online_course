import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AttendanceTable } from "../../components";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { IoMdCheckmarkCircleOutline, IoMdCloseCircle } from "react-icons/io";
import { FaChartBar, FaClock } from "react-icons/fa";
// import { FaUser } from "react-icons/fa";
import "react-tabs/style/react-tabs.css";
import { useSelector } from "react-redux";
import { MdExitToApp, MdStars } from "react-icons/md";
import AdminLayout from "../layout";

const Attendance = () => {
  const { id } = useParams();
  const { userInfo } = useSelector((state) => state.userLogin);
  const [teacher, setTeacher] = useState([]);
  const [selectedTab, setSelectedTab] = useState(null);
  useEffect(() => {
    const fetchGroup = async () => {
      const response = await fetch(
        "https://sql-server-nb7m.onrender.com/api/group",
      );
      const data = await response.json();

      const teacher = data.filter(
        (item) => item.role === "teacher" && `${item.classId}` === `${id}`,
      );

      setTeacher(teacher);
    };

    fetchGroup();
  }, [id]); // ✅ only id
  const user = teacher[0] || {};
  const classesArray = useMemo(() => {
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

  const handleTabSelect = useCallback(
    (index) => {
      setSelectedTab(classesArray[index] || "");
    },
    [classesArray],
  );
  return (
    <AdminLayout>
      <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0 max-w-[1000px]">
        {/* TOP */}
        <div className="flex items-center justify-between">
          {/* Header */}
          <div>
            <div className="attendance-header">
              <h2>Class Attendance</h2>
              <p>Track and manage student attendance records</p>
            </div>

            {/* Status Legend */}
          </div>
          <div className="flex flex-col md:flex-row items-center gap-4  w-full md:w-auto">
            <div className="attendance-legend mr-2">
              <span>
                <IoMdCheckmarkCircleOutline className="text-green-600 size-7" />{" "}
                Present
              </span>
              <span>
                <IoMdCloseCircle className="text-red-500 size-7" /> Absent
              </span>
              <span>
                <FaClock className="text-yellow-500 size-7" /> Late
              </span>
            </div>
            <div className="flex items-center gap-4">
              {userInfo.role === "admin" ? (
                <>
                  {/* <Link to={`/groups/${id}`}>
                    <button
                      className={`w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow`}
                    >
                      <MdExitToApp className="font-semibold text-[18px] text-white" />
                    </button>
                  </Link> */}
                  <Link to={`/grade/${id}`} aria-label="View attendance">
                    <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
                      <FaChartBar className="text-white text-[18px]" />
                    </button>
                  </Link>
                </>
              ) : (
                <>
                  {/* <Link to={`/grade`}>
                  <button
                    className={`w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow`}
                  >
                    <MdExitToApp className="font-semibold text-[18px] text-white" />
                  </button>
                </Link> */}
                  <Link to="/grade" aria-label="View attendance">
                    <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
                      <MdStars className="text-white text-[18px]" />
                    </button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
        {userInfo.role === "admin" ? (
          <Tabs
            onSelect={handleTabSelect}
            selectedIndex={classesArray.indexOf(selectedTab)}
          >
            <TabList>
              {classesArray.map((item, index) => (
                <Tab key={index}>{item}</Tab>
              ))}
            </TabList>
            {classesArray.map((item, index) => (
              <TabPanel key={index}>
                <AttendanceTable selectedTab={selectedTab} />
              </TabPanel>
            ))}
          </Tabs>
        ) : (
          <Tabs onSelect={(index) => setSelectedTab(classesArray[index] || "")}>
            <TabList>
              {classesArray.map((item, index) => (
                <Tab key={index}>{item}</Tab>
              ))}
            </TabList>
            {classesArray.map((item, index) => (
              <TabPanel key={index}>
                <AttendanceTable selectedTab={selectedTab} />
              </TabPanel>
            ))}
          </Tabs>
        )}
      </div>
      <style jsx>{`
        .attendance-header h2 {
          font-size: 22px;
          font-weight: 600;
          color: #1f2937;
        }

        .attendance-header p {
          color: #6b7280;
          margin-top: 4px;
          font-size: 14px;
        }

        .attendance-legend {
          display: flex;
          gap: 20px;
          margin: 20px 0;
          font-size: 14px;
          color: #4b5563;
        }
      `}</style>
    </AdminLayout>
  );
};

export default Attendance;
