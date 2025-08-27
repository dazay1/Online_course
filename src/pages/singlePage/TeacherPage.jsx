import { useParams } from "react-router-dom";
import { BigCalendar, Performance } from "../../components";
import FormModal from "../../components/forms/FormModal";
import { useEffect, useState } from "react";
import { FaPhoneAlt, FaUser } from "react-icons/fa";
import AdminLayout from "../layout";
import { IoMdMail } from "react-icons/io";
import { toast } from "react-toastify";
const TeachersPage = () => {
  const id = useParams();
  const [user, setUser] = useState("");

  useEffect(() => {
    const getUsersById = async () => {
      try {
        const response = await fetch(
          `https://sql-server-nb7m.onrender.com/api/user/:id`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(id),
          }
        );
        const data = await response.json();
        setUser(data);
      } catch (error) {
        toast.error("SErver error please try again", error);
      }
    };
    getUsersById();
  }, [id]);

  return (
    <AdminLayout hidden={true}>
      <div className="w-full flex gap-6">
        {/* LEFT */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* USER INFO CARD */}
          <div className="bg-lamaSky py-6 px-4 rounded-md flex-1 flex gap-4">
            <div className="w-1/3">
              {user.img ? (
                <img
                  src={user.img}
                  alt=""
                  width={144}
                  height={144}
                  className="w-36 h-36 rounded-full object-cover"
                />
              ) : (
                <FaUser className=" w-36 h-36 rounded-full object-cover text-[#cfceff]" />
              )}
            </div>
            <div className="w-2/3 flex flex-col justify-between gap-4">
              <div className="flex items-center gap-4">
                <h3>
                  {user.firstName} {user.lastName}
                </h3>
                <div className="flex gap-0.1">
                  <FormModal
                    table="teacher"
                    type="update"
                    data={{
                      user,
                    }}
                  />
                  <FormModal table="student" type="delete" id={id} />
                </div>
              </div>
              <p>
                One of the best teachers in our school. He is very kind and
                patient and can easily get on well with any student
              </p>
              <div className="flex items-center justify-between gap-2 flex-wrap text-xs font-medium">
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <IoMdMail />
                  <span>{user.email}</span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <FaPhoneAlt />
                  <span>{user.phone | "Should be added"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* RIGHT  */}
        <div className="w-full xl:w-2/3  gap-4">
          <Performance />
          {/* <Announcement /> */}
        </div>
      </div>
      <div className="mt-4 bg-white rounded-md  p-4 h-[800px]">
        <h4>Teacher&apos;s Schedule</h4>
        <BigCalendar firstName={user.firstName} lastName={user.lastName} />
      </div>
    </AdminLayout>
  );
};
export default TeachersPage;
