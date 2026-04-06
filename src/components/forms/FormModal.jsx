"use client";

import { useState, useCallback } from "react";
import { IoIosClose } from "react-icons/io";
import { HiPencilAlt } from "react-icons/hi"; // Better looking edit icon
import { HiTrash, HiPlus, HiLogout } from "react-icons/hi"; // Consistent icon set
import { clearUserInfo } from "../Redux/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { GroupForm, StudentForm, TeacherForm } from "../index";
import GroupStudent from "./GroupStudent";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const FormModal = ({ table, type, data, id, tab, firstName, lastName }) => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.userLogin);
  const email = userInfo?.email;

  // Design mapping
  const config = {
    create: {
      icon: <HiPlus size={18} />,
      color: "bg-amber-400 hover:bg-amber-500",
      label: "Add New",
    },
    update: {
      icon: <HiPencilAlt size={18} />,
      color: "bg-sky-400 hover:bg-sky-500",
      label: "Edit",
    },
    delete: {
      icon: <HiTrash size={18} />,
      color: "bg-red-500 hover:bg-red-600",
      label: "Delete",
    },
    deleteAdmin: {
      icon: <HiLogout size={18} />,
      color: "bg-slate-700 hover:bg-slate-800",
      label: "Logout",
    },
  };

  const currentConfig = config[type] || config.create;

  const handleClear = useCallback(async () => {
    try {
      if (table === "group") {
        const response = await fetch("https://sql-server-nb7m.onrender.com/api/user/group", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        toast.success("Group deleted successfully");
      } else if (table === "profile") {
        dispatch(clearUserInfo());
        navigate("/", { state: { id: email } });
        return; // Exit early as we navigate away
      } else if (table === "studentGroup") {
        const response = await fetch("https://sql-server-nb7m.onrender.com/api/user/student", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tab, firstName, lastName }),
        });
        const resData = await response.json();
        if (resData.message === "User deleted successfully") {
          toast.success("User removed from group");
        } else {
          throw new Error("Failed to delete user");
        }
      } else {
        const response = await fetch("https://sql-server-nb7m.onrender.com/api/user/studentGroup", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        toast.success("Student group deleted");
      }
      setOpen(false);
    } catch (error) {
      console.error(`Error:`, error);
      toast.error(`Operation failed. Please try again.`);
      setOpen(false);
    }
  }, [table, id, tab, firstName, lastName, dispatch, email, navigate]);

  const FormContent = () => {
    if (type === "delete" || type === "deleteAdmin") {
      const isExit = type === "deleteAdmin";
      return (
        <div className="p-8 flex flex-col items-center text-center">
          <div className={`p-4 rounded-2xl mb-4 ${isExit ? "bg-slate-100 text-slate-600" : "bg-red-50 text-red-500"}`}>
            {isExit ? <HiLogout size={40} /> : <HiTrash size={40} />}
          </div>
          <h3 className="text-xl font-black text-slate-800 tracking-tight mb-2">
            {isExit ? "Confirm Logout" : "Are you sure?"}
          </h3>
          <p className="text-slate-500 text-sm mb-8 leading-relaxed">
            {isExit 
              ? "You will need to login again to access your dashboard." 
              : `This action cannot be undone. All data associated with this ${table} will be permanently removed.`}
          </p>
          <div className="flex gap-3 w-full">
            <button 
              onClick={() => setOpen(false)}
              className="flex-1 py-3 px-4 rounded-xl font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 transition-all"
            >
              Cancel
            </button>
            <button 
              onClick={handleClear}
              className={`flex-1 py-3 px-4 rounded-xl font-bold text-white transition-all shadow-lg ${isExit ? "bg-slate-800 shadow-slate-200" : "bg-red-500 shadow-red-200"}`}
            >
              {isExit ? "Logout" : "Delete"}
            </button>
          </div>
        </div>
      );
    }

    const forms = {
      teacher: <TeacherForm type={type} data={data} setOpen={setOpen} />,
      student: <StudentForm type={type} data={data} setOpen={setOpen} />,
      studentGroup: <GroupStudent type={type} data={data} setOpen={setOpen} />,
      group: <GroupForm type={type} data={data} setOpen={setOpen} id={id} />,
    };

    return (
      <div className="p-6">
        <div className="mb-6">
          <h3 className="text-2xl font-black text-slate-800 capitalize tracking-tight">
            {type} {table}
          </h3>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Fill in the information below</p>
        </div>
        {forms[table] || <div className="p-4 text-center text-slate-400 italic">Form component missing for "{table}"</div>}
      </div>
    );
  };

  return (
    <>
      <button
        className={`w-9 h-9 flex items-center justify-center rounded-xl text-white transition-all duration-200 active:scale-90 shadow-sm ${currentConfig.color}`}
        onClick={() => setOpen(true)}
        aria-label={currentConfig.label}
      >
        {currentConfig.icon}
      </button>

      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300" 
            onClick={() => setOpen(false)} 
          />
          
          {/* Modal Container */}
          <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            {/* Close Button */}
            <button
              className="absolute top-6 right-6 p-2 text-slate-300 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-all z-10"
              onClick={() => setOpen(false)}
            >
              <IoIosClose size={28} />
            </button>

            <FormContent />
          </div>
        </div>
      )}
    </>
  );
};

export default FormModal;