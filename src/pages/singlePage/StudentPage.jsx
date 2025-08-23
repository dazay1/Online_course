import { useParams } from "react-router-dom";
import mail from "../../assets/mail.png";
import phone from "../../assets/phone.png";
import { BigCalendar, Performance } from "../../components";
import FormModal from "../../components/forms/FormModal";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";
import AdminLayout from "../layout";
const TeachersPage = () => {
  const id = useParams();
  const [user, setUser] = useState("");

  const { userInfo } = useSelector((state) => state.userLogin);

  useEffect(() => {
    const getUsersById = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/user/:id`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(id),
        });
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.log(error);
      }
    };
    getUsersById();
  }, [id]);
  console.log(user)
  return (
    <AdminLayout hidden={true}>
      <div className="flex-1 p-4 gap-4">
        {/* LEFT */}
        <div className="w-full flex gap-4">
          {/* TOP */}
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
                  <FaUser className=" w-36 h-36 rounded-full object-cover text-lamaPurple" />
                )}
              </div>
              <div className="w-2/3 flex flex-col justify-between  gap-4">
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <h3 className="text-lg">
                      {user.firstName || userInfo.firstName}{" "}
                      {user.lastName || userInfo.lastName}
                    </h3>
                    <div className="flex gap-0.1">
                      <FormModal
                        table="student"
                        type="update"
                        data={{
                          user,
                        }}
                      />
                      <FormModal
                        table="profile"
                        type="delete"
                        id={userInfo.id}
                      />
                    </div>
                  </div>
                  <p>
                    One of the best teachers in our school. He is very kind and
                    patient and can easily get on well with any student
                  </p>
                </div>
                <div>
                  <div className="flex items-center justify-between gap-2 text-xs font-medium mb-4">
                    <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                      <img src={mail} alt="" width={14} height={14} />
                      <span>{user.email || userInfo.email}</span>
                    </div>
                    <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                      <img src={phone} alt="" width={14} height={14} />
                      <span>
                        {user.phone || userInfo.phone || "Should be added"}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-2 text-xs font-medium">
                    <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                      <img src={phone} alt="" width={14} height={14} />
                      <span>
                        {user.fatherPHone ||
                          userInfo.fatherPHone ||
                          "Should be added"}
                      </span>
                    </div>
                    <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                      <img src={phone} alt="" width={14} height={14} />
                      <span>
                        {user.motherPhone ||
                          userInfo.motherPhone ||
                          "Should be added"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* RIGHT */}
          <div className="w-full xl:w-2/3 flex flex-col gap-4">
            <Performance />
          </div>
        </div>
        {/* BOTTOM  */}
        <div className="mt-4 bg-white rounded-md  p-4 h-[800px] w-full">
          <h4>Teacher&apos;s Schedule</h4>
          <BigCalendar firstName={user.firstName} lastName={user.lastName} />
        </div>
      </div>
    </AdminLayout>
  );
};
export default TeachersPage;
