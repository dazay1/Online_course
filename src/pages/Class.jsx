import FormModal from "../components/forms/FormModal";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";
import AdminLayout from "./layout";
const columns = [
  {
    header: "Teacher's Name",
    accessor: "teacherName",
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
    header: "Start",
    accessor: "startTime",
    className: "hidden lg:table-cell",
  },
  {
    header: "End",
    accessor: "endTime",
    className: "hidden lg:table-cell",
  },
  {
    header: "Lesson dates",
    accessor: "lessonDates",
    className: "hidden lg:table-cell",
  },
  {
    header: "Actions",
    accessor: "actions",
  },
];
function ClassPage() {
  const { userInfo } = useSelector((state) => state.userLogin);
  const role = userInfo?.role;
  const [group, setGroup] = useState([]);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const fetchGroup = async () => {
      const response = await fetch("http://localhost:5000/api/group");
      // in the data I also have name of the students I jsut got name of the teacher to put in the website to make it easier
      const data = await response.json();
      const teachers = data.filter((item) => item.role === "teacher");
      setGroup(teachers);
    };
    fetchGroup();
  }, []);

  // Assuming 'data' is the result from your database query
  const nameCount = group.reduce((acc, item) => {
    // Check if the firstName already exists in the accumulator
    if (acc[item.firstName]) {
      acc[item.firstName] += 1; // Increment the count
    } else {
      acc[item.firstName] = 1; // Initialize the count
    }
    return acc;
  }, {});
  const groupedUsers = group.reduce((groups, student) => {
    const existing = groups.find(
      (g) => g.students[0]?.firstName === student.firstName
    );

    if (existing) {
      existing.students.push(student);
    } else {
      groups.push({
        id: student.id, // Use first student's ID as group ID
        students: [student],
      });
    }
    return groups;
  }, []);
  const user = groupedUsers.map((item) => item);
  const allStudentIds = user.flatMap((item) =>
    item.students.map((student) => student.id)
  );
  // Step 2: Count occurrences of each ID
  const idCount = allStudentIds.reduce((acc, id) => {
    acc[id] = (acc[id] || 0) + 1; // Increment count for each ID
    return acc;
  }, {});
  // Now you can log the counts or use them in your rendering
  const renderRow = (item) => (
    <tr key={item.id} className="even:bg-slate-50 text-sm flex ">
      <div className="w-full">
        <div className="flex gap-2">
          <td className="flex gap-4 p-2 mt-2">
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
              <h4 className="font-semibold">
                {item.firstName} {item.lastName}
              </h4>
              <p className="text-xs text-gray-500">{item?.email}</p>
            </div>
          </td>
          <div className="flex flex-col">
            <td className="hidden md:table-cell flex">
              <h4 className="text-[#ae00ff]">
                Specifies: <span>{item.subjects}</span>
              </h4>
            </td>
            <td className="hidden md:table-cell">
              {item.className}
            </td>
            <td className="hidden md:table-cell"></td>
            <td className="hidden md:table-cell">
              {Array.isArray(item.days)
                ? item.days.join(",  ")
                : "Need to schedule a time"}
            </td>
          </div>
        </div>
        <div className="flex justify-end mt-2">
          <a href={`/groups/${item.classId}`}>
            <button
              className={`flex items-center justify-center rounded-lg bg-lamaSky p-2 text-[#ae00ff] font-semibold  buttonOpen`}
              onClick={() => setOpen(true)}
            >
              View in detail
            </button>
          </a>
        </div>
      </div>
    </tr>
  );
  return (
    <AdminLayout>
      <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
        {/* TOP */}
        <div className="flex items-center justify-between">
          <h1 className="hidden md:block text-lg font-semibold">All Groups</h1>
          {role === "admin" && <FormModal table="group" type="create" />}
        </div>
        {/* LIST */}
        <div className="w-full mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {user.map((item) => (
              <div key={item.id} className="border rounded-lg p-4">
                {
                  idCount[item.id] > 1
                    ? renderRow(item.students[0]) // Only render first student if duplicates
                    : item.students.map((student) => renderRow(student)) // Render all if no duplicates
                }
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default ClassPage;
