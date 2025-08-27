import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AttendanceTable } from "../../components";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { FaUser } from "react-icons/fa";
import "react-tabs/style/react-tabs.css";
import { useSelector } from "react-redux";
import { MdExitToApp } from "react-icons/md";
import AdminLayout from "../layout";

const Attendance = () => {
  const { id } = useParams();
  const { userInfo } = useSelector((state) => state.userLogin);
  const [teacher, setTeacher] = useState([]);
  const [selectedTab, setSelectedTab] = useState(null);
  useEffect(() => {
    const fetchGroup = async () => {
      const response = await fetch(
        "https://sql-server-nb7m.onrender.com/api/group"
      );
      // in the data I also have name of the students I jsut got name of the teacher to put in the website to make it easier
      const data = await response.json();
      const teacher = data.filter(
        (item) => item.role === "teacher" && `${item.classId}` === `${id}`
      );
      // Filter students based on the selected tab (class)
      setTeacher(teacher);
    };
    fetchGroup();
  }, [id, userInfo.classes, selectedTab]);

  const user = teacher[0] || {};
  return (
    <AdminLayout>
      <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0 max-w-[1000px]">
        {/* TOP */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 p-4">
            {userInfo.role === "admin" ? (
              user.img ? (
                <img
                  src={user.img}
                  alt=""
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <FaUser className=" w-10 h-10 rounded-full object-cover text-lamaSky" />
              )
            ) : userInfo.img ? (
              <img
                src={userInfo.img}
                alt=""
                width={40}
                height={40}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <FaUser className=" w-10 h-10 rounded-full object-cover text-lamaSky" />
            )}
            <div className="flex flex-col">
              <h3 className="font-semibold ">
                {userInfo.role === "admin"
                  ? user.firstName + " " + user.lastName
                  : userInfo.firstName + " " + userInfo.lastName}
              </h3>
              <p className="text-xs text-gray-500">
                {userInfo.role === "admin" ? user.email : userInfo.email}
              </p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-4  w-full md:w-auto">
            <div className="flex items-center gap-4 self-end">
              {userInfo.role === "admin" ? (
                <Link to={`/groups/${id}`}>
                  <button
                    className={`w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow`}
                  >
                    <MdExitToApp className="font-semibold text-[18px] text-white" />
                  </button>
                </Link>
              ) : (
                <Link to={`/class`}>
                  <button
                    className={`w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow`}
                  >
                    <MdExitToApp className="font-semibold text-[18px] text-white" />
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>
        {userInfo.role === "admin" ? (
          <Tabs onSelect={(index) => setSelectedTab(user.classes[index] || "")}>
            <TabList>
              {user.classes
                ? user.classes.map((item, index) => (
                    <Tab key={index}>{item}</Tab>
                  ))
                : null}
            </TabList>
            {user.classes
              ? user.classes.map((item, index) => (
                  <TabPanel key={index}>
                    <AttendanceTable selectedTab={selectedTab} />
                  </TabPanel>
                ))
              : null}
          </Tabs>
        ) : (
          <Tabs
            onSelect={(index) => setSelectedTab(userInfo.classes[index] || "")}
          >
            <TabList>
              {userInfo.classes
                ? userInfo.classes.map((item, index) => (
                    <Tab key={index}>{item}</Tab>
                  ))
                : null}
            </TabList>
            {userInfo.classes
              ? userInfo.classes.map((item, index) => (
                  <TabPanel key={index}>
                    <AttendanceTable selectedTab={selectedTab} />
                  </TabPanel>
                ))
              : null}
          </Tabs>
        )}
      </div>
    </AdminLayout>
  );
};

export default Attendance;
