"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useSelector } from "react-redux";
import { MdRemoveRedEye, MdPhone, MdCalendarToday } from "react-icons/md";
import { FaUser, FaInfoCircle } from "react-icons/fa";
import { CgPlayListSearch } from "react-icons/cg";
import DatePicker from "react-datepicker";
import { toast } from "react-toastify";
import FormModal from "../components/forms/FormModal";
import { Table } from "../components";
import AdminLayout from "./layout";
import "react-datepicker/dist/react-datepicker.css";

// In-memory cache
let cachedData = null;

const COLUMNS = [
  { header: "Student Details", accessor: "info" },
  { header: "Academic Status", accessor: "status", className: "hidden md:table-cell" },
  { header: "Contact Details", accessor: "phone" },
  { header: "Actions", accessor: "actions", className: "text-right" },
];

const StudentListPage = () => {
  const { userInfo } = useSelector((state) => state.userLogin);
  const role = userInfo?.role;

  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredPhone, setHoveredPhone] = useState(null);
  const [editRowId, setEditRowId] = useState(null);
  const [status, setStatus] = useState({ isLoading: false, error: null });

  useEffect(() => {
    const fetchStudents = async () => {
      if (cachedData) {
        setStudents(cachedData);
        return;
      }
      setStatus({ isLoading: true, error: null });
      try {
        const response = await fetch("https://sql-server-nb7m.onrender.com/api/user/student");
        if (!response.ok) throw new Error("Fetch failed");
        const data = await response.json();
        cachedData = data;
        setStudents(data);
        setStatus({ isLoading: false, error: null });
      } catch (error) {
        setStatus({ isLoading: false, error: "Failed to load data." });
        toast.error("Failed to load student data.");
      }
    };
    fetchStudents();
  }, []);

  const filteredStudents = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return students;
    return students.filter((s) => 
      `${s.firstName} ${s.lastName}`.toLowerCase().includes(query)
    );
  }, [students, searchQuery]);

  const updateStatusDate = useCallback(async (id, date, endpoint, field) => {
    if (!date) return;
    const formattedDate = date.toLocaleDateString('ru-RU'); // DD.MM.YYYY
    try {
      const response = await fetch(`https://sql-server-nb7m.onrender.com/api/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, formattedDate }),
      });
      if (!response.ok) throw new Error("Update failed");
      
      toast.success("Status updated");
      setStudents(prev => prev.map(s => 
        s.id === id ? { ...s, [field]: formattedDate, ...(field === 'keldi' ? { ketdi: null } : {}) } : s
      ));
      setEditRowId(null);
    } catch (err) {
      toast.error("Update failed");
    }
  }, []);

  const renderRow = useCallback((item) => {
    const isInactive = !!item.ketdi;
    const isActive = !!item.keldi;

    return (
      <tr key={item.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/80 transition-all group">
        <td className="p-4">
          <div className={`flex items-center gap-4 border-l-4 pl-3 ${isInactive ? 'border-red-400' : isActive ? 'border-green-400' : 'border-transparent'}`}>
            <div className="h-10 w-10 shrink-0">
              {item.img ? (
                <img src={item.img} alt="" className="h-full w-full rounded-xl object-cover ring-2 ring-white shadow-sm" />
              ) : (
                <div className="h-full w-full rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 font-bold">
                  {item.firstName.charAt(0)}
                </div>
              )}
            </div>
            <div>
              <h3 className="font-bold text-slate-800 tracking-tight leading-tight">
                {item.firstName} {item.lastName}
              </h3>
              <p className="text-[11px] text-slate-500 font-medium uppercase tracking-tighter">
                {item.className || "Unassigned Group"}
              </p>
            </div>
          </div>
        </td>

        <td className="hidden md:table-cell p-4">
          <div className="flex flex-col gap-1">
            {isInactive ? (
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-red-50 text-red-600 rounded text-[10px] font-bold uppercase tracking-wide border border-red-100">Left: {item.ketdi}</span>
                {editRowId === item.id ? (
                  <DatePicker
                    onChange={(date) => updateStatusDate(item.id, date, "status/active", "keldi")}
                    className="w-24 text-[10px] border rounded bg-white p-1 outline-none border-indigo-200"
                    placeholderText="Set Active"
                  />
                ) : (
                  <button onClick={() => setEditRowId(item.id)} className="text-[10px] font-bold text-indigo-600 hover:underline">Re-activate</button>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-green-50 text-green-600 rounded text-[10px] font-bold uppercase tracking-wide border border-green-100">Active</span>
                <div className="relative group/date">
                   <MdCalendarToday className="text-slate-300 hover:text-indigo-500 cursor-pointer" />
                   <div className="absolute left-0 top-0 opacity-0 pointer-events-none group-hover/date:opacity-100 group-hover/date:pointer-events-auto transition-opacity z-20">
                    <DatePicker
                        onChange={(date) => updateStatusDate(item.id, date, "status", "keldi")}
                        className="w-24 text-[10px] border rounded shadow-lg p-1 bg-white"
                        placeholderText="Change Date"
                    />
                   </div>
                </div>
                <span className="text-[10px] text-slate-400">{item.keldi}</span>
              </div>
            )}
          </div>
        </td>

        <td className="p-4 relative">
          <div 
            className="flex items-center gap-2 text-sm text-slate-600 font-medium cursor-help w-fit"
            onMouseEnter={() => setHoveredPhone(item.id)}
            onMouseLeave={() => setHoveredPhone(null)}
          >
            <MdPhone className="text-slate-400" />
            {item.phone || "—"}
            {hoveredPhone === item.id && (
              <div className="absolute bottom-full left-4 mb-2 w-48 bg-slate-800 text-white p-3 rounded-xl shadow-xl z-50 text-[11px] animate-in fade-in slide-in-from-bottom-1">
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between border-b border-slate-700 pb-1 italic uppercase opacity-70">Parent Contacts</div>
                  <div className="flex justify-between"><span>Father:</span> <span className="font-bold">{item.fatherPhone || "N/A"}</span></div>
                  <div className="flex justify-between"><span>Mother:</span> <span className="font-bold">{item.motherPhone || "N/A"}</span></div>
                </div>
                <div className="absolute -bottom-1 left-4 w-2 h-2 bg-slate-800 rotate-45" />
              </div>
            )}
          </div>
        </td>

        <td className="p-4">
          <div className="flex items-center justify-end gap-2">
            <a href={`/students/${item.id}`} className="p-2 rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all shadow-sm">
              <MdRemoveRedEye size={18} />
            </a>
            {role === "admin" && (
              <div className="scale-90 opacity-80 hover:opacity-100 transition-opacity">
                <FormModal table="student" type="delete" id={item.id} />
              </div>
            )}
          </div>
        </td>
      </tr>
    );
  }, [role, editRowId, hoveredPhone, updateStatusDate]);

  return (
    <AdminLayout>
      <div className="m-6 bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden flex flex-col">
        {/* Modern Header */}
        <div className="px-8 py-6 border-b border-slate-50 bg-gradient-to-r from-white to-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Student Roster</h1>
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mt-1 uppercase tracking-widest">
              <FaInfoCircle className="text-indigo-400" />
              {filteredStudents.length} Registered Students
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative group flex-1 md:w-72">
              <CgPlayListSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={22} />
              <input
                className="w-full bg-white border border-slate-200 rounded-2xl py-2.5 pl-10 pr-4 text-sm outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 transition-all shadow-sm"
                placeholder="Search by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            {role === "admin" && (
              <div className="shrink-0 text-white rounded-2xl  transition-all  cursor-pointer">
                <FormModal table="student" type="create" />
              </div>
            )}
          </div>
        </div>

        {/* Loading/Content states */}
        <div className="relative min-h-[400px]">
          {status.isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10 backdrop-blur-[1px]">
               <div className="flex flex-col items-center gap-2">
                  <div className="h-8 w-8 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Loading Records</span>
               </div>
            </div>
          ) : status.error ? (
            <div className="p-20 text-center text-red-500 font-medium">{status.error}</div>
          ) : (
            <div className="overflow-x-auto">
              <Table columns={COLUMNS} renderRow={renderRow} data={filteredStudents} />
              {filteredStudents.length === 0 && (
                <div className="p-24 text-center">
                  <FaUser className="mx-auto text-slate-100 mb-4" size={64} />
                  <p className="text-slate-400 font-medium tracking-tight">No students found matching your criteria</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default StudentListPage;