"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { MdRemoveRedEye, MdSearch, MdPersonOff } from "react-icons/md";
import { FaUser, FaChevronDown, FaChevronUp, FaPlus } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Table } from "../components";
import FormModal from "../components/forms/FormModal";
import AdminLayout from "./layout";

// --- Constants & Types ---
const COLUMNS = [
  { header: "Teacher Profile", accessor: "info" },
  { header: "Subjects", accessor: "subjects", className: "hidden md:table-cell" },
  { header: "Classes", accessor: "groups", className: "hidden lg:table-cell" },
  { header: "Contact", accessor: "phone", className: "hidden xl:table-cell" },
  { header: "Actions", accessor: "actions", className: "text-right" },
];

// --- Sub-Components ---

const ExpandableCell = ({ items }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const dataArray = Array.isArray(items) ? items : [];

  if (!dataArray.length) return <span className="text-slate-400 italic text-xs">Unassigned</span>;

  const displayItems = isExpanded ? dataArray : dataArray.slice(0, 2);

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex flex-wrap gap-1">
        {displayItems.map((item, i) => (
          <span key={i} className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-md text-[10px] font-bold border border-indigo-100 uppercase tracking-tight">
            {item}
          </span>
        ))}
      </div>
      {dataArray.length > 2 && (
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-[10px] font-bold text-slate-500 hover:text-indigo-600 transition-colors flex items-center gap-1 w-fit"
        >
          {isExpanded ? <FaChevronUp /> : <><FaChevronDown /> +{dataArray.length - 2} more</>}
        </button>
      )}
    </div>
  );
};

// --- Main Component ---

let cachedData = null; // Global cache to persist across re-renders

const TeachersListPage = () => {
  const { userInfo } = useSelector((state) => state.userLogin);
  const role = userInfo?.role;

  const [teachers, setTeachers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Data Fetching
  useEffect(() => {
    if (cachedData) {
      setTeachers(cachedData);
      return;
    }

    const controller = new AbortController();
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch("https://sql-server-nb7m.onrender.com/api/user/teacher", { signal: controller.signal });
        if (!res.ok) throw new Error("Could not fetch staff directory");
        const data = await res.json();
        cachedData = data;
        setTeachers(data);
      } catch (err) {
        if (err.name !== "AbortError") setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    return () => controller.abort();
  }, []);

  // Search Logic
  const filteredTeachers = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return teachers.filter(t => 
      `${t.firstName} ${t.lastName}`.toLowerCase().includes(q) ||
      t.email?.toLowerCase().includes(q)
    );
  }, [teachers, searchQuery]);

  // Row Renderer
  const renderRow = useCallback((item) => (
    <tr key={item.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/80 transition-all group">
      <td className="p-4">
        <div className="flex items-center gap-4">
          <div className="relative h-11 w-11 shrink-0">
            {item.img ? (
              <img src={item.img} alt="" className="h-full w-full rounded-2xl object-cover shadow-sm ring-2 ring-white" />
            ) : (
              <div className="h-full w-full rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-400">
                <FaUser size={18} />
              </div>
            )}
            <div className="absolute -bottom-1 -right-1 h-3.5 w-3.5 bg-green-500 border-2 border-white rounded-full" title="Active" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 tracking-tight leading-tight">{item.firstName} {item.lastName}</h3>
            <span className="text-xs text-slate-500 font-medium">{item?.email || "No email"}</span>
          </div>
        </div>
      </td>
      <td className="hidden md:table-cell p-4">
        <span className="text-sm text-slate-600 font-medium tracking-tight">
          {Array.isArray(item.subjects) ? item.subjects.join(" • ") : "General Education"}
        </span>
      </td>
      <td className="hidden lg:table-cell p-4">
        <ExpandableCell items={item.classes} />
      </td>
      <td className="hidden xl:table-cell p-4 text-sm font-medium text-slate-500 italic">
        {item.phone || "N/A"}
      </td>
      <td className="p-4">
        <div className="flex items-center justify-end gap-2">
          <a 
            href={`/teachers/${item.id}`} 
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-200 hover:shadow-sm transition-all"
            title="View Profile"
          >
            <MdRemoveRedEye size={20} />
          </a>
          {role === "admin" && (
            <div className="opacity-40 hover:opacity-100 transition-opacity">
              <FormModal table="teacher" type="delete" id={item.id} />
            </div>
          )}
        </div>
      </td>
    </tr>
  ), [role]);

  return (
    <AdminLayout>
      <div className="m-6 bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        {/* Top Header */}
        <div className="px-8 py-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-slate-50 bg-gradient-to-b from-white to-slate-50/30">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Faculty Members</h1>
            <p className="text-sm text-slate-500 font-medium mt-1">Manage and organize your academic staff records.</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative flex-1 lg:w-80">
              <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={22} />
              <input
                type="text"
                placeholder="Search by name or email..."
                className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            {role === "admin" && (
              <div className="bg-indigo-600 text-white p-3.5 rounded-2xl hover:bg-indigo-700 transition-transform active:scale-95 shadow-lg shadow-indigo-200 cursor-pointer">
                <FormModal table="teacher" type="create" />
              </div>
            )}
          </div>
        </div>

        {/* Content Area */}
        <div className="relative min-h-[400px]">
          {loading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 z-10">
              <div className="h-10 w-10 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin mb-4" />
              <p className="text-slate-500 font-bold text-sm">Syncing Directory...</p>
            </div>
          ) : error ? (
            <div className="p-20 text-center">
              <div className="bg-red-50 text-red-600 px-6 py-4 rounded-2xl inline-block border border-red-100">
                <p className="font-bold">Error: {error}</p>
                <button onClick={() => window.location.reload()} className="text-xs underline mt-2">Try Again</button>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table columns={COLUMNS} renderRow={renderRow} data={filteredTeachers} />
              
              {filteredTeachers.length === 0 && (
                <div className="flex flex-col items-center justify-center py-24 text-slate-400">
                  <MdPersonOff size={48} className="mb-4 opacity-20" />
                  <p className="font-medium">No faculty members found</p>
                  <p className="text-xs">Try adjusting your search filters</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default TeachersListPage;