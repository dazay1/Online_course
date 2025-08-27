import { format } from "date-fns";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { toast } from "react-toastify";

function DatePick({ payment, data, id, day, amount, paid }) {
  const [status, setStatus] = useState(payment);
  const [way, setWay] = useState(null);
  const [descriptions, setDescriptions] = useState({});
  const [selectedDay, setSelectedDay] = useState(null);
  const [amountPaid, setAmountPaid] = useState(""); // State for the payment amount
  const [hoveredPhone, setHoveredPhone] = useState(null); // State for hovered phone

  // Set the initial date from data when the component mounts
  useEffect(() => {
    if (data && day) {
      const parsedDate = new Date(day);
      if (!isNaN(parsedDate.getTime())) {
        // Check if the date is valid
        setSelectedDay(parsedDate);
      } else {
        console.error("Invalid date format:", data.date);
      }
    }
  }, [data]);

  const handleStatusChange = (e, itemId) => {
    setStatus((prev) => ({
      ...prev,
      status: e.target.value,
    }));
    setDescriptions((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
    setWay((prev) => ({
      ...prev,
      status: e.target.value,
    }));

    // Reset amountPaid when status changes to "notPaid"
    if (e.target.value === "notPaid") {
      setAmountPaid("");
    }
  };

  const handleDateChange = async (date) => {
    const localDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate() + 1
    );
    const formattedDate = localDate.toISOString().split("T")[0];
    const columnName =
      formattedDate.split("-")[1] === "07"
        ? "july"
        : formattedDate.split("-")[1] === "08"
        ? "aug"
        : formattedDate.split("-")[1] === "09"
        ? "sep"
        : formattedDate.split("-")[1] === "10"
        ? "oct"
        : formattedDate.split("-")[1] === "11"
        ? "nov"
        : formattedDate.split("-")[1] === "12"
        ? "decem"
        : "";
    const wayPaid =
      formattedDate.split("-")[1] === "07"
        ? "wayJuly"
        : formattedDate.split("-")[1] === "08"
        ? "wayAug"
        : formattedDate.split("-")[1] === "09"
        ? "waySep"
        : formattedDate.split("-")[1] === "10"
        ? "wayOct"
        : formattedDate.split("-")[1] === "11"
        ? "wayNov"
        : formattedDate.split("-")[1] === "12"
        ? "wayDec"
        : "";
    try {
      const request = await fetch(
        `https://sql-server-nb7m.onrender.com/api/date`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            day: formattedDate,
            id: id,
            status: status.status,
            amountPaid: amountPaid,
            columnName: columnName,
            way: wayPaid,
            wayPaid: way, // Include amount only if paid
          }),
        }
      );
      if (request.ok) {
        toast.success("Date updated successfully");
      } else {
        toast.error("Error updating date");
      }
    } catch (error) {
      console.error("Error fetching data from the server:", error);
      toast.error("Server error please try again");
    }
  };

  return (
    <>
      <td
        className="hidden md:table-cell"
        onMouseEnter={() => setHoveredPhone(id)}
        onMouseLeave={() => setHoveredPhone(null)}
      >
        <select
          value={status ? status.status : "To'lanmagan"}
          onChange={(e) => handleStatusChange(e, id)}
          className="status-select mr-4"
        >
          <option value="paid">To'langan</option>
          <option value="notPaid">To'lanmagan</option>
        </select>
        {hoveredPhone === id && (
          <div className="absolute bg-white p-2 z-10">
            <p className="text-black">
              Oylik to'lovi: {amount || "yozilmagan"}
            </p>
            <p className="text-black">To'lov turi: {paid || "yozilmagan"}</p>
          </div>
        )}
      </td>
      <td className="hidden md:table-cell">
        <DatePicker
          selected={selectedDay} // Use selected prop to control the date
          onChange={handleDateChange}
          dateFormat="yyyy-MM-dd"
          placeholderText="Select a date"
          className="mr-2 max-w-24"
        />
      </td>
      {status &&
        status.status === "paid" && ( // Conditionally render the input
          <td className="hidden md:table-cell">
            <div className="tooltip mb-2">
              <input
                type="number"
                value={amountPaid}
                onChange={(e) => setAmountPaid(e.target.value)} // Update amountPaid state
                placeholder="Amount Paid"
                className="border rounded p-1"
              />
            </div>
            <div className="tooltip">
              <select
                value={way.status}
                onChange={(e) => setWay(e.target.value)}
                className="status-select mr-4"
              >
                <option value="plastik">Plastik</option>
                <option value="nalichka">Nalichka</option>
              </select>
            </div>
          </td>
        )}
    </>
  );
}

export default DatePick;
