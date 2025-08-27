import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import FormModal from "../../components/forms/FormModal";
import { Table } from "../../components";
import "react-datepicker/dist/react-datepicker.css";

import { FaChartBar } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { MdRemoveRedEye } from "react-icons/md";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import AdminLayout from "../layout";
import DatePick from "../../components/forms/DatePicker";

const columns = [
  {
    header: "Student's Name",
    accessor: "studentName",
  },
  {
    header: "Subjects",
    accessor: "subjects",
    className: "hidden md:table-cell",
  },
  {
    header: "Payment",
    accessor: "payment",
    className: "hidden lg:table-cell",
  },
  {
    header: "Date",
    accessor: "Date",
    className: "hidden lg:table-cell",
  },
  {
    header: "Phone",
    accessor: "Phone",
    className: "hidden lg:table-cell",
  },
  {
    header: "Actions",
    accessor: "actions",
  },
];

function Class() {
  const { id } = useParams();
  const { userInfo } = useSelector((state) => state.userLogin);
  const role = userInfo?.role;
  const [group, setGroup] = useState([]);
  const [teacher, setTeacher] = useState([]);
  const [selectedTab, setSelectedTab] = useState(""); //fault to the first class
  const [hoveredPhone, setHoveredPhone] = useState(null); // State for hovered phone
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchGroup = async () => {
      const response = await fetch(
        "https://sql-server-nb7m.onrender.com/api/group"
      );
      const data = await response.json();
      const teacher = data.filter(
        (item) => item.role === "teacher" && `${item.classId}` === `${id}`
      );
      const students = data.filter((item) => {
        return (
          item.role === "student" &&
          item.name === selectedTab &&
          item.ketdi === null
        );
      });
      setTeacher(teacher);
      setGroup(students);
    };
    fetchGroup();
  }, [id, userInfo.classes, selectedTab]);

  const filteredTeachers = group.filter((teacher) => {
    const fullName = `${teacher.firstName} ${teacher.lastName}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  });

  const user = teacher[0] || {};
  const renderRow = (item) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight "
    >
      <td className="flex items-center gap-4 p-4">
        {item.img ? (
          <img
            src={item.img}
            alt=""
            width={40}
            height={40}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <FaUser className=" w-10 h-10 rounded-full object-cover text-lamaSky" />
        )}
        <div className="flex flex-col">
          <h3 className="font-semibold">
            {item.firstName} {item.lastName}
          </h3>
          <p className="text-xs text-gray-500">{item?.email}</p>
        </div>
      </td>
      <td className="hidden md:table-cell">{item.subjects}</td>
      <DatePick
        payment={item.payment}
        data={group}
        id={item.id}
        day={item.weekDay}
      />
      <td
        className="hidden md:table-cell text-sm"
        onMouseEnter={() => setHoveredPhone(item.id)}
        onMouseLeave={() => setHoveredPhone(null)}
      >
        {item.phone || "Should be added"}
        {hoveredPhone === item.id && (
          <div className="absolute bg-white p-2 z-10">
            <p className="text-black">
              Adasi: {item.fatherPhone || "yozilmagan"}
            </p>
            <p className="text-black">
              Oyisi: {item.motherPhone || "yozilmagan"}
            </p>
          </div>
        )}
      </td>
      <td>
        <div className="flex items-center gap-2 ml-1">
          <a href={`/students/${item.id}`}>
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
  );

  return (
    <AdminLayout>
      <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
        {/* TOP */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 p-2">
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
              <input
                className="bg-transparent border border-gray-300 rounded-md focus:outline-none p-1 focus:border-gray-500"
                placeholder="Search..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)} // Update search query on input change
              />
              {userInfo.role === "admin" ? (
                <>
                  <Link to={`/attendance/${id}`}>
                    <button
                      className={`w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow`}
                    >
                      <FaChartBar className="font-semibold text-[18px] text-white" />
                    </button>
                  </Link>
                  <FormModal
                    table="studentGroup"
                    type="create"
                    data={selectedTab}
                  />
                </>
              ) : (
                <Link to={`/attendance`}>
                  <button
                    className={`w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow`}
                  >
                    <FaChartBar className="font-semibold text-[18px] text-white" />
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
                    <Table
                      columns={columns}
                      renderRow={renderRow}
                      data={filteredTeachers}
                    />
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
                    <Table
                      columns={columns}
                      renderRow={renderRow}
                      data={filteredTeachers}
                    />
                  </TabPanel>
                ))
              : null}
          </Tabs>
        )}
        {/* LIST */}
        {/* <Table columns={columns} renderRow={renderRow} data={group} /> */}
        {/* <TeachersTable role={role} /> */}
        {/* PAGINATION */}
        {/* <Pagination /> */}
      </div>
    </AdminLayout>
  );
}

export default Class;
