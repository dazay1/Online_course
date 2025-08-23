"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useEffect } from "react";
const schema = z.object({
  groupName: z
    .string()
    .min(3, { message: "Username must be at least 2 characters long!" })
    .max(20, { message: "Username must be at most 20 characters long!" }),
  startTime: z.string().min(1, {message: "Time is required"}),
  endTime: z.string().min(1, {message: "Time is required"}),
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  subjects: z.string().min(1, {message: 'Subject name is required'}),
  lessonDate: z.string().min(1, {message: 'Days of the lesson should be added'}),
});
const GroupStudent = ({ type, data, setOpen }) => {
  const id = useParams();
  const [teachers, setTeachers] = useState([]);
  const [teacherData, setTeacherData] = useState([]);
  const selectedTab = data;
  const [number, setNumber] = useState({
    groupName: "",
    firstName: "",
    lastName: "",
    subjects: "",
    startTime: "",
    endTime: "",
    lessonDate: ""
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });
  const onSubmit = handleSubmit(
    async (data) => {
      console.log(data);
      try {
        if (type === "create") {
          setNumber((prev) => ({
            ...prev,
            subjects: data.subjects,
            startTime: data.startTime,
            endTime: data.endTime,
            lessonDate: data.lessonDate,
            firstName: data.firstName,
            lastName: data.lastName,
          }));
          const date = await fetch(
            "http://localhost:5000/api/user/group/page",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(number),
            }
          );
          const data = await date.json();
          console.log(data)
          const correct = data.message === "Student registered successfully";
          const exists = data.message === "Student already exists"; // Adjust based on your API response
          if (correct) {
            setOpen(false);
            toast.success("Student registered successfully");
          } else if (exists) {
            setOpen(false);
            toast.error("Student already exists");
          }
        } else {
          toast.error("Form type not found");
        }
      } catch (error) {
        toast.error("An error occurred while processing your request.");
      }
      setTeachers(data);
    },
    (errors) => {
      console.log("Validation errors:", errors); // Debugging output
      toast.error("Validation error occured please try again");
    }
  );
  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">Add student to the group</h1>
      <span className="text-xs text-gray-400 font-medium">
        Authentication Information
      </span>
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Group Name"
          name="groupName"
          defaultValue={
            type === "create" ? data?.name : data.name
          }
          register={register}
          error={errors?.groupName}
        />
        <InputField
          label="Start Time"
          name="startTime"
          type="startTime"
          defaultValue={
            type === "create" ? data?.startTime : data.startTime
          }
          register={register}
          error={errors?.startTime}
        />
        <InputField
          label="End Time"
          name="endTime"
          type="endTime"
          defaultValue={type === "create" ? data?.endTime : data.endTime}
          register={register}
          error={errors?.endTime}
        />
        <InputField
          label="Lesson's Date"
          name="lessonDate"
          type="lessonDate"
          defaultValue={
            type === "create" ? data?.days : data.days  
          }
          register={register}
          error={errors?.lessonDate}
        />
        <InputField
          label="Subject"
          name="subjects"
          defaultValue={
            type === "create" ? data?.subjects : data.subjects
          }
          register={register}
          error={errors?.subjects}
        />
      </div>
      <span className="text-xs text-gray-400 font-medium">
        Personal Information
      </span>
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="First Name"
          name="firstName"
          defaultValue={
            type === "create" ? data?.firstName : data.user?.firstName
          }
          register={register}
          error={errors?.firstName}
        />
        <InputField
          label="Last Name"
          name="lastName"
          defaultValue={
            type === "create" ? data?.lastName : data.user?.lastName
          }
          register={register}
          error={errors?.lastName}
        />
      </div>

      <button className="bg-blue-400 text-white p-2 rounded-md" type="submit">
        {type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default GroupStudent;
