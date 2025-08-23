import React, { useEffect, useState } from "react";
import { FaUser , FaCheck, FaTimes, FaClock, FaMinusCircle } from "react-icons/fa";
import { IoMdCheckmarkCircleOutline, IoMdCloseCircle } from "react-icons/io";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

const AttendanceTable = ({ selectedTab }) => {
  const { id } = useParams();
  const userInfo = useSelector((state) => state.userLogin);
  const [students, setStudents] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [teacher, setTeacher] = useState([]);
  const [teacherName, setTeacherName] = useState([]);
  const [futureDates, setFutureDates] = useState([]);
  const [editingRecord, setEditingRecord] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedStudentId, setSelectedStudentId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const Groupresponse = await fetch("http://localhost:5000/api/group");
        const data = await Groupresponse.json();
        
        // Get the lesson days from the selected tab
        const lessonDaysString = data
          .filter(item => item.name === selectedTab)
          .map(item => item.day)[0]; // Get the first matching day's string

        
        // Convert lesson days string to an array of day numbers
        const lessonDays = convertDaysStringToArray(lessonDaysString);

        console.log(lessonDays, lessonDaysString);
        const teacherName = data.filter((item) => item.role === "teacher" && `${item.id}` === `${userInfo.userInfo.id}`);
        const teacher = data.filter(
          (item) => item.role === "teacher" && `${item.classId}` === `${id}`
        );
        const students = data.filter((item) => {
          return item.role === "student" && item.name === selectedTab && item.ketdi === null;
        });
        setTeacherName(teacherName);
        setStudents(students);
        setTeacher(teacher);
        const attendanceResponse = await fetch(
          "http://localhost:5000/api/attendance"
        );
        const attendanceRecords = await attendanceResponse.json();
        setAttendanceData(attendanceRecords);

        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();
        const futureDatesArray = [];

        const firstDay = new Date(currentYear, currentMonth, 1);
        const lastDay = new Date(currentYear, currentMonth + 1, 0);
        
        // Generate future dates based on lessonDays
        for (let day = firstDay.getDate(); day <= lastDay.getDate(); day++) {
          const futureDate = new Date(currentYear, currentMonth, day);
          if (lessonDays.includes(futureDate.getDay())) { // Check if the day is in lessonDays
            futureDatesArray.push(futureDate.toLocaleDateString());
          }
        }
        setFutureDates(futureDatesArray);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Server error please try again");
      }
    };

    fetchData();
  }, [id, selectedTab]);

  // Function to convert lesson days string to an array of day numbers
  const convertDaysStringToArray = (daysString) => {
    const daysMap = {
      Mon: 1,
      Tue: 2,
      Wed: 3,
      Thurs: 4,
      Fri: 5,
      Sat: 6,
      Sun: 0,
    };

    return daysString.split(", ").map(day => daysMap[day.trim()]).filter(day => day !== undefined);
  };

  const handleIconClick = (studentId, date, status, classId) => {
    setEditingRecord({
      studentId,
      date,
      status,
      classId,
    });
    setSelectedStudentId(studentId);
    setSelectedDate(date);
  };

  const handleStatusChange = (e) => {
    setEditingRecord((prev) => ({
      ...prev,
      status: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/attendance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentId: editingRecord.studentId,
          date: editingRecord.date,
          status: editingRecord.status,
          classId: editingRecord.classId,
        }),
      });

      if (response.ok) {
        setAttendanceData((prev) =>
          prev
            .filter(
              (r) =>
                !(
                  r.student_id === editingRecord.studentId &&
                  r.attendance_date.split("T")[0] === editingRecord.date
                )
            )
            .concat({
              student_id: editingRecord.studentId,
              attendance_date: editingRecord.date,
              status: editingRecord.status,
              classId: id,
            })
        );
        setEditingRecord(null);
        toast.success("Attendance updated successfully!");
      } else {
        toast.error("Failed to update attendance.");
      }
    } catch (error) {
      console.error("Error updating attendance:", error);
      toast.error("Error updating attendance.");
    }
  };

  const getStatusIcon = (status, studentId, date) => {
    switch (status) {
      case "present":
        return (
          <IoMdCheckmarkCircleOutline
            data-tip="Present"
            className="text-green-500 cursor-pointer hover:text-green-700 text-[24px]"
            onClick={() => handleIconClick(studentId, date, "present", id || teacherName.classId)}
          />
        );
      case "absent":
        return (
          <IoMdCloseCircle
            className="text-red-500 cursor-pointer hover:text-redDark text-[24px]"
            onClick={() => handleIconClick(studentId, date, "absent", id || teacherName.classId)}
          />
        );
      case "late":
        return (
          <FaClock
            className="text-yellow-500 cursor-pointer hover:text-yellow-700 text-[24px]"
            onClick={() => handleIconClick(studentId, date, "late", id || teacherName.classId)}
          />
        );
      case "null":
        return (
          <FaMinusCircle
            className="text-gray-300 cursor-pointer hover:text-gray-500 text-[24px]"
            onClick={() => handleIconClick(studentId, date, "absent", id || teacherName.classId)}
          />
        );
    }
  };

  return (
    <div className="attendance-container">
      {editingRecord && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Confirm Attendance</h3>
            <p>Student ID: {editingRecord.studentId}</p>
            <p>Date: {editingRecord.date}</p>
            <select
              value={editingRecord.status}
              onChange={handleStatusChange}
              className="status-select"
            >
              <option value="absent">Kemadi</option>
              <option value="present">Keldi</option>
              <option value="late">Sababli</option>
            </select>
            <div className="modal-actions">
              <button onClick={() => setEditingRecord(null)}>Cancel</button>
              <button onClick={handleSubmit}>Confirm</button>
            </div>
          </div>
        </div>
      )}
      <div className="table-responsive">
        <table className="w-full mt-4 attendance-table">
          <thead>
            <tr className="text-left text-gray-500 text-sm gap-10">
              <th className="sticky left-0 bg-white z-10">Student Name</th>
              {futureDates.map((date) => (
                <th key={date}>{date}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr
                key={student.id}
                className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
              >
                <td className="flex items-center gap-4 p-4 sticky left-0 bg-white z-10">
                  {student.img ? (
                    <img
                      src={student.img}
                      alt=""
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <FaUser  className="w-10 h-10 rounded-full object-cover text-lamaSky" />
                  )}
                  <div className="flex flex-col">
                    <h3 className="font-semibold">
                      {student.firstName} {student.lastName}
                    </h3>
                    <p className="text-xs text-gray-500">{student?.email}</p>
                  </div>
                </td>
                {futureDates.map((date) => {
                  const [day, month, year] = date.split(".");
                  const formattedDate = `${year}-${month}-${day}`;
                  const record = attendanceData.find(
                    (r) =>
                      r.student_id === student.id &&
                      r.attendance_date.split("T")[0] === formattedDate
                  );
                  const status = record ? record.status : "null";
                  return (
                    <td key={`${student.id}-${date}`}>
                      <div className="flex justify-center">
                        {getStatusIcon(status, student.id, formattedDate)}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <style jsx>{`
        .attendance-container {
          padding: 20px;
          max-width: 1600px;
          overflow-x: auto;
        }
        .table-responsive {
          overflow-x: auto;
        }
        .attendance-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }
        .attendance-table th,
        .attendance-table td {
          padding: 10px;
          border: 1px solid #ddd;
          text-align: left;
        }
        .attendance-table th {
          background-color: #f2f2f2;
          position: sticky;
          top: 0;
        }
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        .modal {
          background: white;
          padding: 20px;
          border-radius: 8px;
          width: 300px;
        }
        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
        }
        .status-select {
          margin: 15px 0;
          padding: 8px;
          width: 100%;
        }
        .attendance-cell {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .edit-button {
          padding: 2px 8px;
          background-color: #f0f0f0;
          border: 1px solid #ccc;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
        }
        
        .edit-button:hover {
          background-color: #e0e0e0;
        }
      `}</style>
    </div>
  );
};

export default AttendanceTable;
