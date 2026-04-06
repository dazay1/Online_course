// Grade.jsx
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { FaUser } from "react-icons/fa";
import { MdExitToApp } from "react-icons/md";
import "react-tabs/style/react-tabs.css";
import { useSelector } from "react-redux";
import AdminLayout from "../pages/layout";
import StarsTable from "./charts/StarsTable";

const Grade = () => {
  const { id } = useParams();
  const { userInfo } = useSelector((s) => s.userLogin);
  const [teacher, setTeacher] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [selectedTab, setSelectedTab] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const [groupRes, lessonRes] = await Promise.all([
        fetch("https://sql-server-nb7m.onrender.com/api/group"),
        fetch("https://sql-server-nb7m.onrender.com/api/lesson"),
      ]);
      const groups = await groupRes.json();
      const lessons = await lessonRes.json();

      const teacherData = groups.filter(
        (i) => i.role === "teacher" && `${i.classId}` === `${id}`,
      );
      setTeacher(teacherData);
      setLessons(lessons);
    };
    fetchData();
  }, [id]);

  const user = teacher[0] || {};

  const classesArray = useMemo(() => {
    const names =
      userInfo.role === "admin" ? user.className : userInfo.className;
    return typeof names === "string" ? names.split(", ").filter(Boolean) : [];
  }, [teacher, userInfo]);

  const handleTabSelect = useCallback(
    (idx) => setSelectedTab(classesArray[idx] || ""),
    [classesArray],
  );

  const studentsInClass = lessons.filter(
    (l) =>
      l.name === selectedTab &&
      (userInfo.role === "admin"
        ? user.firstName === l.firstName
        : userInfo.firstName === l.firstName),
  );

  return (
    <AdminLayout>
      <div className="bg-white rounded-lg shadow-md p-6 m-4 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-3">
            {userInfo.role === "admin" ? (
              user.img ? (
                <img
                  src={user.img}
                  alt=""
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <FaUser className="w-12 h-12 rounded-full bg-sky-100 p-2 text-sky-600" />
              )
            ) : userInfo.img ? (
              <img
                src={userInfo.img}
                alt=""
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <FaUser className="w-12 h-12 rounded-full bg-sky-100 p-2 text-sky-600" />
            )}
            <div>
              <h3 className="font-semibold text-lg">
                {userInfo.role === "admin"
                  ? `${user.firstName} ${user.lastName}`
                  : `${userInfo.firstName} ${userInfo.lastName}`}
              </h3>
              <p className="text-sm text-gray-500">
                {userInfo.role === "admin" ? user.email : userInfo.email}
              </p>
            </div>
          </div>
          <Link
            to={userInfo.role === "admin" ? `/attendance/${id}` : `/attendance`}
            className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
          >
            <MdExitToApp className="w-5 h-5" />
            <span className="hidden sm:inline">Back</span>
          </Link>
        </div>

        {/* Tabs */}
        {classesArray.length > 0 ? (
          <Tabs
            onSelect={handleTabSelect}
            selectedIndex={classesArray.indexOf(selectedTab)}
          >
            <TabList className="flex flex-wrap gap-2 border-b mb-6">
              {classesArray.map((c, i) => (
                <Tab
                  key={i}
                  className="px-4 py-2 rounded-t-md cursor-pointer transition-colors
                             ui-selected:bg-yellow-500 ui-selected:text-white
                             ui-not-selected:bg-gray-100 ui-not-selected:text-gray-700"
                >
                  {c}
                </Tab>
              ))}
            </TabList>

            {classesArray.map((c, i) => (
              <TabPanel key={i}>
                <StarsTable
                  selectedClass={c}
                  studentsStar={studentsInClass}
                  teacherId={userInfo.role === "admin" ? user.id : userInfo.id}
                />
              </TabPanel>
            ))}
          </Tabs>
        ) : (
          <p className="text-center text-gray-500 py-8">No classes assigned.</p>
        )}
      </div>
    </AdminLayout>
  );
};

export default Grade;
