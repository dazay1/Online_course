import { useEffect, useState } from "react";
import { FaUser, FaClock, FaMinusCircle } from "react-icons/fa";
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
        const Groupresponse = await fetch(
          "https://sql-server-nb7m.onrender.com/api/group",
        );
        const data = await Groupresponse.json();

        // Get the lesson days from the selected tab
        const lessonDaysString = data
          .filter((item) => item.name === selectedTab)
          .map((item) => item.day)[0]; // Get the first matching day's string

        if (!lessonDaysString) return;
        // Convert lesson days string to an array of day numbers
        const lessonDays = convertDaysStringToArray(lessonDaysString);

        const teacherName = data.filter(
          (item) =>
            item.role === "teacher" &&
            `${item.id}` === `${userInfo.userInfo.id}`,
        );
        const teacher = data.filter(
          (item) => item.role === "teacher" && `${item.classId}` === `${id}`,
        );
        const students = data.filter((item) => {
          return (
            item.role === "student" &&
            item.name === selectedTab &&
            item.ketdi === null
          );
        });
        setTeacherName(teacherName);
        setStudents(students);
        setTeacher(teacher);
        const attendanceResponse = await fetch(
          "https://sql-server-nb7m.onrender.com/api/attendance",
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
          if (lessonDays.includes(futureDate.getDay())) {
            // Check if the day is in lessonDays
            futureDatesArray.push(futureDate.toISOString().split("T")[0]);
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

    return daysString.split(", ").reduce((acc, day) => {
      const parsedDay = daysMap[day.trim()];
      if (parsedDay !== undefined) {
        acc.push(parsedDay);
      }
      return acc;
    }, []);
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
      const response = await fetch(
        "https://sql-server-nb7m.onrender.com/api/attendance",
        {
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
        },
      );

      if (response.ok) {
        setAttendanceData((prev) =>
          prev
            .filter(
              (r) =>
                !(
                  r.student_id === editingRecord.studentId &&
                  r.attendance_date.split("T")[0] === editingRecord.date
                ),
            )
            .concat({
              student_id: editingRecord.studentId,
              attendance_date: editingRecord.date,
              status: editingRecord.status,
              classId: id,
            }),
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
            onClick={() =>
              handleIconClick(
                studentId,
                date,
                "present",
                id || teacherName.classId,
              )
            }
          />
        );
      case "absent":
        return (
          <IoMdCloseCircle
            className="text-red-500 cursor-pointer hover:text-redDark text-[24px]"
            onClick={() =>
              handleIconClick(
                studentId,
                date,
                "absent",
                id || teacherName.classId,
              )
            }
          />
        );
      case "late":
        return (
          <FaClock
            className="text-yellow-500 cursor-pointer hover:text-yellow-700 text-[24px]"
            onClick={() =>
              handleIconClick(
                studentId,
                date,
                "late",
                id || teacherName.classId,
              )
            }
          />
        );
      case "null":
        return (
          <FaMinusCircle
            className="text-gray-300 cursor-pointer hover:text-gray-500 text-[24px]"
            onClick={() =>
              handleIconClick(
                studentId,
                date,
                "absent",
                id || teacherName.classId,
              )
            }
          />
        );
    }
  };

  return (
    <div className="attendance-wrapper">
      {editingRecord && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Update Attendance</h3>
            <div className="modal-content">
              <p>
                <strong>Student ID:</strong> {editingRecord.studentId}
              </p>
              <p>
                <strong>Date:</strong> {editingRecord.date}
              </p>
            </div>

            <select
              value={editingRecord.status}
              onChange={handleStatusChange}
              className="status-select"
            >
              <option value="present">Present (Keldi)</option>
              <option value="absent">Absent (Kemadi)</option>
              <option value="late">Late (Sababli)</option>
            </select>

            <div className="modal-actions">
              <button
                className="btn-secondary"
                onClick={() => setEditingRecord(null)}
              >
                Cancel
              </button>
              <button className="btn-primary" onClick={handleSubmit}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="table-container">
        <table className="attendance-table">
          <thead>
            <tr>
              <th className="sticky-col">Student</th>
              {futureDates.map((date) => {
                const formatted = new Date(date).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "long",
                });
                return <th key={date}>{formatted}</th>;
              })}
            </tr>
          </thead>

          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td className="student-cell sticky-col">
                  {student.img ? (
                    <img src={student.img} alt="" className="student-avatar" />
                  ) : (
                    <FaUser className="avatar-icon" />
                  )}
                  <div>
                    <div className="student-name">
                      {student.firstName} {student.lastName}
                    </div>
                    <div className="student-email">{student.email}</div>
                  </div>
                </td>

                {futureDates.map((date) => {
                  const record = attendanceData.find(
                    (r) =>
                      r.student_id === student.id &&
                      r.attendance_date.split("T")[0] === date,
                  );

                  const status = record ? record.status : "null";

                  return (
                    <td key={`${student.id}-${date}`} className="status-cell">
                      {getStatusIcon(status, student.id, date)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style jsx>{`
        .table-container {
          overflow-x: auto;
        }

        .attendance-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 14px;
        }

        .attendance-table th {
          background: #f9fafb;
          padding: 12px;
          font-weight: 600;
          color: #374151;
          border-bottom: 1px solid #e5e7eb;
        }

        .attendance-table td {
          padding: 12px;
          border-bottom: 1px solid #f1f5f9;
        }

        .attendance-table tr:hover {
          background: #f8fafc;
        }

        .sticky-col {
          position: sticky;
          left: 0;
          background: white;
          z-index: 5;
        }

        .student-cell {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .student-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          object-fit: cover;
        }

        .avatar-icon {
          font-size: 28px;
          color: #9ca3af;
        }

        .student-name {
          font-weight: 500;
          color: #111827;
        }

        .student-email {
          font-size: 12px;
          color: #9ca3af;
        }

        .status-cell {
          text-align: center;
          cursor: pointer;
        }

        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.4);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .modal {
          background: white;
          padding: 25px;
          border-radius: 12px;
          width: 350px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
        }

        .modal h3 {
          font-size: 18px;
          margin-bottom: 15px;
          color: #111827;
        }

        .status-select {
          width: 100%;
          padding: 10px;
          margin-top: 15px;
          border-radius: 8px;
          border: 1px solid #d1d5db;
        }

        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 20px;
        }

        .btn-primary {
          background: #2563eb;
          color: white;
          padding: 8px 16px;
          border-radius: 8px;
          border: none;
          cursor: pointer;
        }

        .btn-primary:hover {
          background: #1d4ed8;
        }

        .btn-secondary {
          background: #e5e7eb;
          color: #374151;
          padding: 8px 16px;
          border-radius: 8px;
          border: none;
          cursor: pointer;
        }

        .btn-secondary:hover {
          background: #d1d5db;
        }
      `}</style>
    </div>
  );
};

export default AttendanceTable;
