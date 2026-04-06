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

const columns = [
  { header: "Info", accessor: "info" },
  { header: "Status", accessor: "status" },
  { header: "Payment", accessor: "payment" },
  { header: "Phone", accessor: "phone" },
  { header: "Actions", accessor: "actions" },
];

function StudentListPage() {
  const { userInfo } = useSelector((state) => state.userLogin);
  const role = userInfo?.role;
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredPhone, setHoveredPhone] = useState(null);
  const [editRowId, setEditRowId] = useState(null); // Track which row is in edit mode
  const [selectedMonth, setSelectedMonth] = useState("july"); // Default month
  const [paymentStatus, setPaymentStatus] = useState("all"); // Default payment status

  useEffect(() => {
    const fetchStudents = async () => {
      const response = await fetch(
        "https://sql-server-nb7m.onrender.com/api/payment"
      );
      const data = await response.json();
      setStudents(data);
    };
    fetchStudents();
  }, []);

  const isPaid = (student) => {
    if (paymentStatus === "paid") {
      if (selectedMonth === "july") {
        return (
          student.july !== null && student.july > 0 && student.keldiAug === null
        );
      } else if (selectedMonth === "aug") {
        return student.aug !== null && student.aug > 0;
      } else if (selectedMonth === "sep") {
        return student.sep !== null && student.sep > 0;
      }
    } else if (paymentStatus === "notPaid") {
      if (selectedMonth === "july") {
        return student.july === null || student.july === 0;
      } else if (selectedMonth === "aug") {
        return student.aug === null || student.aug === 0;
      } else if (selectedMonth === "sep") {
        return student.sep === null || student.sep === 0;
      }
    }
    return paymentStatus === "all"; // Show all if 'all' selected
  };

  const filteredStudents = students.filter((student) => {
    const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase()) && isPaid(student);
  });

  const handleActiveChange = async (item, date) => {
    // Your existing code for handling date change here
  };

  const handleDateChange = async (item, date) => {
    // Your existing code for handling date change here
  };

  const renderRow = (item) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight relative"
    >
      <td className="flex items-center gap-4 p-4 min-w-[220px]">
        {item.img ? (
          <img
            src={item.img}
            alt=""
            width={40}
            height={40}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <FaUser className="w-12 h-12 rounded-full bg-sky-100 p-2 text-sky-600" />
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
      <td className="min-w-[180px]">
        {item.ketdiJuly ? (
          <div className="flex items-center">
            <span>{item.ketdiJuly}</span>
            <button
              onClick={() => setEditRowId(item.id)}
              className="ml-2 text-blue-500"
            >
              {editRowId === item.id ? (
                <DatePicker
                  selected={null}
                  onChange={(date) => handleActiveChange(item, date)}
                  dateFormat="yyyy-MM-dd"
                  placeholderText="Select a Date"
                  className="mr-2 max-w-[120px]"
                  onClick={(e) => e.stopPropagation()}
                  autoFocus
                />
              ) : (
                "Set Active"
              )}
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <DatePicker
              selected={null}
              onChange={(date) => handleDateChange(item, date)}
              dateFormat="yyyy-MM-dd"
              placeholderText="Active"
              className="mr-2 max-w-[120px]"
            />
            <p>{item.keldiAug || ""}</p>
          </div>
        )}
      </td>
      <td className="min-w-[150px]">
        <DatePick
          payment={item.payment}
          data={item}
          id={item.payment_id}
          day={item.weekDay}
          amount={
            selectedMonth === "july"
              ? item.july
              : selectedMonth === "aug"
              ? item.aug
              : item.sep
          }
          paid={
            selectedMonth === "july"
              ? item.wayJuly
              : selectedMonth === "aug"
              ? item.wayAug
              : item.waySep
          }
        />
      </td>
      <td
        className="min-w-[140px] text-sm relative"
        onMouseEnter={() => setHoveredPhone(item.payment_id)}
        onMouseLeave={() => setHoveredPhone(null)}
      >
        {item.phone || "Should be added"}
        {hoveredPhone === item.payment_id && (
          <div className="absolute top-full left-0 mt-1 bg-white p-2 rounded shadow-lg z-50 w-48">
            <p className="text-black">
              Adasi: {item.fatherPhone || "yozilmagan"}
            </p>
            <p className="text-black">
              Oyisi: {item.motherPhone || "yozilmagan"}
            </p>
          </div>
        )}
      </td>
      <td className="min-w-[100px]">
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
      <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0 width">
        {/* TOP */}
        <div className="flex items-center justify-between flex-col md:flex-row">
          <h1 className="text-lg font-semibold mb-4">All Students</h1>
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="flex items-center gap-4 md:self-end justify-between">
              <input
                className="bg-transparent border w-full border-gray-300 rounded-md focus:outline-none p-1 focus:border-gray-500"
                placeholder="Search..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="border md:w-full w-16 border-gray-300 rounded-md p-1"
              >
                <option value="july">July</option>
                <option value="aug">August</option>
                <option value="sep">September</option>
              </select>
              <select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value)}
                className="border border-gray-300 w-28 rounded-md p-1"
              >
                <option value="all">All</option>
                <option value="paid">To'langan</option>
                <option value="notPaid">To'lanmagan</option>
              </select>
            </div>
          </div>
        </div>
        {/* LIST */}
        <div className="overflow-x-auto mt-4">
          <Table
            columns={columns}
            renderRow={renderRow}
            data={filteredStudents}
            className="min-w-full"
          />
        </div>
      </div>
    </AdminLayout>
  );
}

export default StudentListPage;
