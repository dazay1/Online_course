"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import the CSS for toast notifications
const schema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long!" })
    .max(20, { message: "Username must be at most 20 characters long!" }),
  email: z.string().email({ message: "Invalid email" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long!" }),
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  phone: z.string().min(1, { message: "Phone number is required" }),
  sex: z.enum(["male", "female"], { message: "Gender is required" }),
  subjects: z
    .string(
      z.object({
        name: z.string().min(1, { message: "Subject name is required" }),
        code: z.string().optional(), // Optional field for subject code
        // Add more fields as necessary
      })
    )
    .optional(), // Make subjects optional if neede
  // img: z
  //   .instanceof(File)
  //   .optional()
  //   .refine((file) => file instanceof File, {
  //     message: "Invalid file",
  //   }),
});
const TeacherForm = ({ type, data, setOpen }) => {
  const { id } = useParams();
  const [teachers, setTeachers] = useState([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });


  const onSubmit = handleSubmit(
    async (data) => {
      console.log(teachers);
      try {
        if (type === "create") {
          console.log(data);
          const response = await fetch(
            "http://localhost:5000/api/user/teacher/page",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(data),
            }
          );
          const request = await response.json();
          console.log(request);
          const correct = request.message === "Teacher registered successfully";
          const exists = request.message === "Teacher already exists"; // Adjust based on your API response
          if (correct) {
            setOpen(false);
            toast.success("Teacher registered successfully");
          } else if (exists) {
            setOpen(false);
            toast.error("Teacher already exists");
          }
        } else if (type === "update") {
          // Handle the update logic here
          const response = await fetch(`http://localhost:5000/api/user/${id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          });
          const result = await response.json();
          console.log(result);
          const correct = result.message === "User updated successfully";
          if (correct) {
            setOpen(false); // Close the modal if the teacher is updated successfully
            toast.success("Teacher updated successfully");
          }
        } else {
          toast.error("Form type not found");
        }
      } catch (error) {
        toast.error("An error occurred while processing your request."); // Notify on error
      }
      setTeachers(data);
    },
    (errors) => {
      console.log("Validation errors:", errors); // Debugging output
      toast.error('Validation error occured please try again');
    }
  );
  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create" : "Update"} a teacher
      </h1>
      <span className="text-xs text-gray-400 font-medium">
        Authentication Information
      </span>
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Username"
          name="username"
          defaultValue={
            type === "create" ? data?.username : data.user?.username
          }
          register={register}
          error={errors?.username}
        />
        <InputField
          label="Email"
          name="email"
          type="email"
          defaultValue={type === "create" ? data?.email : data.user?.email}
          register={register}
          error={errors?.email}
        />
        <InputField
          label="Password"
          name="password"
          type="password"
          defaultValue={
            type === "create" ? data?.password : data.user?.password
          }
          register={register}
          error={errors?.password}
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
        <InputField
          label="Phone"
          name="phone"
          defaultValue={type === "create" ? data?.phone : data.user?.phone}
          register={register}
          error={errors?.phone}
        />
        <InputField
          label="Subjects"
          name="subjects"
          defaultValue={
            type === "create" ? data?.subjects : data.user?.subjects
          }
          register={register}
          error={errors?.phone}
        />
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Sex</label>
          <select
            {...register("sex")}
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            defaultValue={type === "create" ? data?.sex : data.user?.sex}
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          {errors.sex?.message && (
            <p className="text-xs text-red-400">
              {errors.sex?.message.toString()}
            </p>
          )}
        </div>
        {/* <div className="flex flex-col gap-2 w-full md:w-1/4 justify-center">
          <label
            className="text-xs text-gray-500 flex items-center gap-2 cursor-pointer"
            htmlFor="img"
          >
            <IoCloudUploadOutline fontSize={24} />
            <span>Upload a photo</span>
          </label>
          <input type="file" id="img" {...register("img")} className="hidden" />
          {errors.img?.message && (
            <p className="text-xs text-red-400">
              {errors.img?.message.toString()}
            </p>
          )}
        </div> */}
      </div>
      <button className="bg-blue-400 text-white p-2 rounded-md" type="submit">
        {type === "create" ? "Create" : "Update"}
      </button>

    </form>
  );
};

export default TeacherForm;
