import { MdRemoveRedEye } from "react-icons/md";
import { CiSearch } from "react-icons/ci";
import { GiSettingsKnobs } from "react-icons/gi";
import { FaSortAmountDown } from "react-icons/fa";
import { Table } from "../components";
import FormModal from "../components/forms/FormModal";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";
import AdminLayout from "./layout";
const columns = [
  {
    header: "Info",
    accessor: "info",
  },
  {
    header: "Subjects",
    accessor: "subjects",
    className: "hidden md:table-cell",
  },
  {
    header: "Groups",
    accessor: "groups",
    className: "hidden lg:table-cell",
  },
  {
    header: "Phone",
    accessor: "phone",
    className: "hidden lg:table-cell",
  },
  {
    header: "Actions",
    accessor: "actions",
  },
];
function TeachersListPage() {
  const { userInfo } = useSelector((state) => state.userLogin);
  const role = userInfo?.role;
  const [teachers, setTeachers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchTeachers = async () => {
      const response = await fetch("http://localhost:5000/api/user/teacher");
      const data = await response.json();
      setTeachers(data);
    };
    fetchTeachers();
  }, []);

  const filteredTeachers = teachers.filter((teacher) => {
    const fullName = `${teacher.firstName} ${teacher.lastName}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  });
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
      <td className="hidden md:table-cell">
        {Array.isArray(item.subjects)
          ? item.subjects.join(",  ")
          : "General teacher"}
      </td>
      <td className="hidden md:table-cell">
        {Array.isArray(item.classes)
          ? item.classes.join(",  ")
          : "Don't have a group yet"}
      </td>
      <td className="hidden md:table-cell">
        {item.phone || "Should be added"}
      </td>
      <td>
        <div className="flex items-center gap-2">
          <a href={`/teachers/${item.id}`}>
            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaSky">
              <MdRemoveRedEye />
            </button>
          </a>
          {role === "admin" && (
            <FormModal table="teacher" type="delete" id={item.id} />
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
          <h1 className="hidden md:block text-lg font-semibold">
            All Teachers
          </h1>
          <div className="flex flex-col md:flex-row items-center gap-4  w-full md:w-auto">
            <div className="flex items-center gap-4 self-end">
              <input
                className="bg-transparent border border-gray-300 rounded-md focus:outline-none p-1 focus:border-gray-500"
                placeholder="Search..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)} // Update search query on input change
              />
              {role === "admin" && <FormModal table="teacher" type="create" />}
            </div>
          </div>
        </div>
        {/* LIST */}
        <Table columns={columns} renderRow={renderRow} data={filteredTeachers} />
      </div>
    </AdminLayout>
  );
}

export default TeachersListPage;
