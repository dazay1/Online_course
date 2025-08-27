"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import the CSS for toast notifications
const schema = z.object({
  groupName: z
    .string()
    .min(3, { message: "Username must be at least 2 characters long!" })
    .max(20, { message: "Username must be at most 20 characters long!" }),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  lessonDate: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
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
const GroupForm = ({ type, data, setOpen, id }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = handleSubmit(
    async (data) => {
      try {
        if (type === "create") {
          const response = await fetch(
            "https://sql-server-nb7m.onrender.com/api/user/group/page",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(data),
            }
          );
          const request = await response.json();
          const correct = request.message === "Group created successfully";
          const exists = request.message === "Group already exists"; // Adjust based on your API response
          if (correct) {
            setOpen(false);
            toast.success("Group created successfully");
          } else if (exists) {
            setOpen(false);
            toast.error("Group already exists");
          }
        } else if (type === "update") {
          // Handle the update logic here
          const response = await fetch(
            `https://sql-server-nb7m.onrender.com/api/user/group/${id}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(data),
            }
          );
          const result = await response.json();
          const correct = result.message === "Group updated successfully";
          if (correct) {
            setOpen(false); // Close the modal if the teacher is updated successfully
            toast.success("Group updated successfully");
          }
        } else {
          toast.error("Form type not found");
        }
      } catch (error) {
        toast.error("An error occurred while processing your request."); // Notify on error
      }
    },
    (errors) => {
      toast.error("Validation error occured please try again");
    }
  );
  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create" : "Update"} a group
      </h1>
      <span className="text-xs text-gray-400 font-medium">Group Set up</span>
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Group Name"
          name="groupName"
          defaultValue={type === "create" ? data?.name : data.name}
          register={register}
          error={errors?.groupName}
        />
        <InputField
          label="Start Time"
          name="startTime"
          type="startTime"
          defaultValue={type === "create" ? data?.startTime : data.startTime}
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
          defaultValue={type === "create" ? data?.days : data.days}
          register={register}
          error={errors?.lessonDate}
        />
        <InputField
          label="Subject"
          name="subjects"
          defaultValue={type === "create" ? data?.subjects : data.subjects}
          register={register}
          error={errors?.subjects}
        />
      </div>
      <span className="text-xs text-gray-400 font-medium">
        Information of the Teacher
      </span>
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="First Name"
          name="firstName"
          defaultValue={type === "create" ? data?.firstName : data.firstName}
          register={register}
          error={errors?.firstName}
        />
        <InputField
          label="Last Name"
          name="lastName"
          defaultValue={type === "create" ? data?.lastName : data.lastName}
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

export default GroupForm;
