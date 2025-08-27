import { MdRemoveRedEye } from "react-icons/md";
import FormModal from "../components/forms/FormModal";
import { Table } from "../components";
import { FaUser } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import AdminLayout from "./layout";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Import the CSS for DatePicker
import DatePick from "../components/forms/DatePicker";
import { toast } from "react-toastify";

const columns = [
  {
    header: "Info",
    accessor: "info",
  },
  {
    header: "Status",
    accessor: "Status",
    className: "hidden md:table-cell",
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

function StudentListPage() {
  const { userInfo } = useSelector((state) => state.userLogin);
  const role = userInfo?.role;
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredPhone, setHoveredPhone] = useState(null); // State for hovered phone
  const [edit, setEdit] = useState(false);
  useEffect(() => {
    const fetchStudents = async () => {
      const response = await fetch(
        "https://sql-server-nb7m.onrender.com/api/user/student"
      );
      const data = await response.json();
      setStudents(data);
    };
    fetchStudents();
  }, []);

  // Filter students based on the search query
  const filteredStudents = students.filter((student) => {
    const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  });

  const handleActiveChange = async (item, date) => {
    if (date) {
      const day = date.getDate(); // Get the day
      const month = String(date.getMonth() + 1).padStart(2, "0"); // Get the month (0-indexed, so add 1) and pad with leading zero
      const year = date.getFullYear(); // Get the year
      // Format the date to 'DD.MM.YYYY'
      const formattedDate = `${day}.${month}.${year}`;
      const id = item.id;
      const dataId = { id, formattedDate };
      const response = await fetch(
        "https://sql-server-nb7m.onrender.com/api/status/active",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataId),
        }
      );
      const data = await response.json();
      if (response) {
        toast.success("Date updated successfully");
      } else {
        toast.error("Date failed to update");
      }
    }
  };

  const handleDateChange = async (item, date) => {
    if (date) {
      const day = date.getDate(); // Get the day
      const month = String(date.getMonth() + 1).padStart(2, "0"); // Get the month (0-indexed, so add 1) and pad with leading zero
      const year = date.getFullYear(); // Get the year
      // Format the date to 'DD.MM.YYYY'
      const formattedDate = `${day}.${month}.${year}`;
      const id = item.id;
      const dataId = { id, formattedDate };
      const response = await fetch(
        "https://sql-server-nb7m.onrender.com/api/status",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataId),
        }
      );
      const data = await response.json();
      if (response) {
        toast.success("Date updated successfully");
      } else {
        toast.error("Date failed to update");
      }
    }
  };

  const renderRow = (item) => (
    <tr
      key={item.id}
      className={`border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight`}
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
          <FaUser className="w-10 h-10 rounded-full object-cover text-lamaSky" />
        )}
        <div className="flex flex-col">
          <h3
            className="font-semibold"
            style={{ color: item.keldi ? "green" : item.ketdi ? "red" : "" }}
          >
            {item.firstName} {item.lastName}
          </h3>
          <p className="text-xs text-gray-500">
            Group Name: {item.className || "kiritilmagan"}
          </p>
        </div>
      </td>
      <td className="hidden md:table-cell">
        {item.ketdi ? (
          <div className="flex items-center">
            <span>{item.ketdi}</span>
            <button
              onClick={() => setEdit(true)}
              className="ml-2 text-blue-500"
            >
              <span style={{ display: edit ? "none" : "block" }}>
                Set Active
              </span>
              {edit && (
                <DatePicker
                  selected={null} // No date selected initially
                  onChange={(date) => handleActiveChange(item, date)} // Handle date change
                  dateFormat="yyyy-MM-dd"
                  placeholderText="Select a Date"
                  className="mr-2 max-w-24"
                />
              )}
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-[-30px]">
            <DatePicker
              selected={null} // No date selected initially
              onChange={(date) => handleDateChange(item, date)} // Handle date change
              dateFormat="yyyy-MM-dd"
              placeholderText="Active"
              className="mr-2 max-w-16"
            />
            <p>{item.keldi ? item.keldi : ""}</p>
          </div>
        )}
      </td>
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
        <div className="flex items-center gap-2">
          <a href={`/students/${item.id}`}>
            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaSky">
              <MdRemoveRedEye />
            </button>
          </a>
          {role === "admin" && (
            <FormModal table="student" type="delete" id={item.id} />
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
            All Students
          </h1>
          <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
            <div className="flex items-center gap-4 self-end">
              <input
                className="bg-transparent border border-gray-300 rounded-md focus:outline-none p-1 focus:border-gray-500"
                placeholder="Search..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)} // Update search query on input change
              />
              {role === "admin" && <FormModal table="student" type="create" />}
            </div>
          </div>
        </div>
        {/* LIST */}
        <Table
          columns={columns}
          renderRow={renderRow}
          data={filteredStudents}
        />{" "}
        {/* Use filtered students */}
      </div>
    </AdminLayout>
  );
}

export default StudentListPage;
