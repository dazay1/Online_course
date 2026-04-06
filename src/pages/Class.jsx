import FormModal from "../components/forms/FormModal";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { FaUser, FaBookOpen, FaLayerGroup, FaChevronDown, FaChevronUp } from "react-icons/fa";
import AdminLayout from "./layout";

const TeacherCard = ({ teacher }) => {
  const [showAllClasses, setShowAllClasses] = useState(false);
  
  // Logic to handle multiple classes (assuming they come as a comma-separated string or array)
  const classList = teacher.className ? teacher.className.split(",") : [];
  const displayClasses = showAllClasses ? classList : classList.slice(0, 2);
  const hasMore = classList.length > 2;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-full group">
      {/* Profile Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative">
          {teacher.img ? (
            <img
              src={teacher.img}
              alt={teacher.firstName}
              className="w-16 h-16 rounded-2xl object-cover ring-4 ring-slate-50"
            />
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500 ring-4 ring-indigo-50">
              <FaUser size={28} />
            </div>
          )}
          <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></span>
        </div>
        <div>
          <h4 className="font-bold text-slate-900 text-lg group-hover:text-indigo-600 transition-colors">
            {teacher.firstName} {teacher.lastName}
          </h4>
          <p className="text-sm text-slate-500 font-medium">{teacher?.email}</p>
        </div>
      </div>

      {/* Specialty */}
      <div className="flex items-center gap-2 mb-4 p-3 bg-slate-50 rounded-xl">
        <FaBookOpen className="text-indigo-400" size={14} />
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Expertise:</span>
        <span className="text-sm font-semibold text-slate-700">{teacher.subjects}</span>
      </div>

      {/* Classes Section - The "Show More" Logic */}
      <div className="flex-1">
        <div className="flex items-center justify-between mb-2 px-1">
          <div className="flex items-center gap-2 text-slate-500">
            <FaLayerGroup size={14} />
            <span className="text-xs font-bold uppercase tracking-wider">Assigned Classes</span>
          </div>
          <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-bold">
            {classList.length}
          </span>
        </div>

        <div className="flex flex-wrap gap-2 transition-all duration-500">
          {displayClasses.map((cls, index) => (
            <span 
              key={index} 
              className="px-3 py-1 bg-white border border-slate-200 text-slate-600 text-xs font-medium rounded-lg shadow-sm"
            >
              {cls.trim()}
            </span>
          ))}
          
          {hasMore && (
            <button
              onClick={() => setShowAllClasses(!showAllClasses)}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 mt-1 transition-colors"
            >
              {showAllClasses ? (
                <><FaChevronUp size={10} /> Show Less</>
              ) : (
                <><FaChevronDown size={10} /> +{classList.length - 2} More</>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Footer Action */}
      <div className="mt-6">
        <a href={`/attendance/${teacher.classId}`}>
          <button className="w-full py-3 bg-slate-900 hover:bg-indigo-600 text-white font-bold rounded-xl transition-all shadow-md active:scale-95">
            View Full Group Detail
          </button>
        </a>
      </div>
    </div>
  );
};

function ClassPage() {
  const { userInfo } = useSelector((state) => state.userLogin);
  const role = userInfo?.role;
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    const fetchGroup = async () => {
      const response = await fetch("https://sql-server-nb7m.onrender.com/api/group");
      const data = await response.json();
      
      // Filtering unique teachers to avoid visual duplicates
      const teacherOnly = data.filter((item) => item.role === "teacher");
      const uniqueTeachers = Array.from(new Map(teacherOnly.map(t => [t.id, t])).values());
      
      setTeachers(uniqueTeachers);
    };
    fetchGroup();
  }, []);

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Academic Groups</h1>
            <p className="text-slate-500 mt-1">Overview of teacher leads and their respective class assignments.</p>
          </div>
          {role === "admin" && (
            <div className="shrink-0">
              <FormModal table="group" type="create" />
            </div>
          )}
        </div>

        {/* Grid Display */}
        {teachers.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3">
            {teachers.map((teacher) => (
              <TeacherCard key={teacher.id} teacher={teacher} />
            ))}
          </div>
        ) : (
          <div className="h-64 flex items-center justify-center border-2 border-dashed border-slate-200 rounded-3xl">
            <p className="text-slate-400 font-medium">No teaching groups found...</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default ClassPage;