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
    header: "Payment",
    accessor: "payment",
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
  const [hoveredPhone, setHoveredPhone] = useState(null);
  const [edit, setEdit] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("june"); // Default month
  const [paymentStatus, setPaymentStatus] = useState("all"); // Default payment status
  const [amount, setAmount] = useState([]);
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
    // const left = student.ketdiJuly ? student.ketdiJuly.split(".")[1] : '';
    // const come = student.keldiAug ? student.kelAug.split(".")[1] : '';
    if (paymentStatus === "paid") {
      if (selectedMonth === "july") {
        return (
          student.july !== null && student.july > 0 && student.keldiAug === null
        ); // Check if payment exists for July
      } else if (selectedMonth === "aug") {
        return student.aug !== null && student.aug > 0; // Check if payment exists for August
      } else if (selectedMonth === "sep") {
        return student.sep !== null && student.sep > 0; // Check if payment exists for September
      }
    } else if (paymentStatus === "notPaid") {
      if (selectedMonth === "july") {
        return student.july === null || student.july === 0; // Check if payment is not made for July
      } else if (selectedMonth === "aug") {
        return student.aug === null || student.aug === 0; // Check if payment is not made for August
      } else if (selectedMonth === "sep") {
        return student.sep === null || student.sep === 0; // Check if payment is not made for September
      }
    }
    return false; // Default case if no conditions are met
  };
  const filteredStudents = students.filter((student) => {
    const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase()) && isPaid(student);
  });

  // return fullName.includes(searchQuery.toLowerCase())
  const handleActiveChange = async (item, date) => {
    // ... (existing code for handling date change)
  };

  const handleDateChange = async (item, date) => {
    // ... (existing code for handling date change)
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
        {item.ketdiJuly ? (
          <div className="flex items-center">
            <span>{item.ketdiJuly}</span>
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
              className="mr-2 max-w-18"
            />
            <p>{item.keldiAug ? item.keldiAug : ""}</p>
          </div>
        )}
      </td>
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
      <td
        className="hidden md:table-cell text-sm"
        onMouseEnter={() => setHoveredPhone(item.payment_id)}
        onMouseLeave={() => setHoveredPhone(null)}
      >
        {item.phone || "Should be added"}
        {hoveredPhone === item.payment_id && (
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
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="border border-gray-300 rounded-md p-1"
              >
                <option value="july">July</option>
                <option value="aug">August</option>
                <option value="sep">September</option>
                {/* Add more months as needed */}
              </select>
              <select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value)}
                className="border border-gray-300 rounded-md p-1"
              >
                <option value="all">All</option>
                <option value="paid">Paid</option>
                <option value="notPaid">Not Paid</option>
              </select>
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
