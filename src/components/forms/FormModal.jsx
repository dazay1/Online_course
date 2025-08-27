"use client";

import { useState } from "react";
import { IoIosClose, IoIosCreate } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { IoExit } from "react-icons/io5";
import { FaPlus } from "react-icons/fa";
import { clearUserInfo } from "../Redux/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { GroupForm, StudentForm, TeacherForm } from "../index";
import GroupStudent from "./GroupStudent";
import { useNavigate } from "react-router-dom";
const FormModal = ({ table, type, data, id, tab, firstName, lastName }) => {
  const forms = {
    teacher: (type, data) => (
      <TeacherForm type={type} data={data} setOpen={setOpen} />
    ),
    student: (type, data) => (
      <StudentForm type={type} data={data} setOpen={setOpen} />
    ),
    studentGroup: (type, data) => (
      <GroupStudent type={type} data={data} setOpen={setOpen} />
    ),
    group: (type, data) => (
      <GroupForm type={type} data={data} setOpen={setOpen} id={id} />
    ),
  };
  const size = type === "create" ? "w-8 h-8" : "w-7 h-7";
  const bgColor =
    type === "create"
      ? "bg-lamaYellow"
      : type === "update"
      ? "bg-lamaSky"
      : "bg-red-500";

  const [open, setOpen] = useState(false);
  const history = useNavigate();
  const Form = ({ setOpen }) => {
    const dispatch = useDispatch();
    const dataId = { id };
    const userInfo = useSelector((state) => state.userLogin);
    const email = userInfo.userInfo.email;
    const handleClear = async () => {
      if (table === "group") {
        const response = await fetch(
          "https://sql-server-nb7m.onrender.com/api/user/group",
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(dataId),
          }
        );
        const data = await response.json();
      } else if (table === "profile") {
        dispatch(clearUserInfo());
        history("/", { state: { id: email } });
      } else if (table === "studentGroup") {
        const dataId = { tab, firstName, lastName };
        const response = await fetch(
          "https://sql-server-nb7m.onrender.com/api/user/student",
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(dataId),
          }
        );

        const data = await response.json();
        setOpen(false);
      } else {
        const dataId = { id };
        const response = await fetch(
          "https://sql-server-nb7m.onrender.com/api/user/studentGroup",
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(dataId),
          }
        );
        const data = await response.json();
        setOpen(false);
      }
    };
    return type === "delete" && id && table ? (
      <form action="" className="p-4 flex flex-col gap-4">
        <span className="text-center font-medium">
          All data will be lost. Are you sure you want to delete this {table}{" "}
          account?
        </span>
        <button
          className="bg-red-500 text-white py-2 px-4 rounded-md border-none w-max self-center"
          onClick={handleClear}
        >
          Delete
        </button>
      </form>
    ) : type === "create" || type === "update" ? (
      forms[table](type, data, setOpen, id)
    ) : type === "deleteAdmin" ? (
      <form action="" className="p-4 flex flex-col gap-4">
        <span className="text-center font-medium">
          All data will be lost. Are you sure you want to exit from account?
        </span>
        <button
          className="bg-red-500 text-white py-2 px-4 rounded-md border-none w-max self-center"
          onClick={handleClear}
        >
          Delete
        </button>
      </form>
    ) : (
      "Form don't exist"
    );
  };
  return (
    <>
      {type === "delete" ? (
        <button
          className={`${size} flex items-center justify-center rounded-full ${bgColor}`}
          onClick={() => setOpen(true)}
        >
          <MdDelete className="text-white text-[18px]" />
        </button>
      ) : type === "deleteAdmin" ? (
        <button
          className={`${size} flex items-center justify-center rounded-full ${bgColor}`}
          onClick={() => setOpen(true)}
        >
          <IoExit className="text-white text-[18px]" />
        </button>
      ) : type === "create" ? (
        <button
          className={`${size} flex items-center justify-center rounded-full ${bgColor}`}
          onClick={() => setOpen(true)}
        >
          <FaPlus className="text-white font-semibold text-[18px]" />
        </button>
      ) : type === "update" ? (
        <button
          className={`${size} flex items-center justify-center rounded-full ${bgColor} `}
          onClick={() => setOpen(true)}
        >
          <IoIosCreate className="text-white text-[18px]" />
        </button>
      ) : null}
      {open && (
        <div className="w-screen h-screen absolute top-0 left-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-md relative w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%]">
            <Form setOpen={setOpen} />
            <div
              className="absolute top-4 right-4 cursor-pointer"
              onClick={() => setOpen(false)}
            >
              <IoIosClose fontSize={20} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FormModal;
