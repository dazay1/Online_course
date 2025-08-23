import { BigCalendar, Performance } from "../../components";
import FormModal from "../../components/forms/FormModal";
import { useSelector } from "react-redux";
import { FaPhoneAlt, FaUser } from "react-icons/fa";
import { IoMdMail } from "react-icons/io";
import AdminLayout from "../layout";
const TeacherSinglePage = () => {
  const { userInfo } = useSelector((state) => state.userLogin);
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
                {userInfo.img ? (
                  <img
                    src={userInfo.img}
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
                    {userInfo.firstName} {userInfo.lastName}
                  </h3>
                  <div className="flex gap-0.1">
                    <FormModal
                      table="teacher"
                      type="update"
                      data={{
                        userInfo,
                      }}
                    />
                    <FormModal table="profile" type="delete" id={userInfo.id} />
                  </div>
                </div>
                <p>
                  One of the best teachers in our school. He is very kind and
                  patient and can easily get on well with any student
                </p>
                <div className="flex items-center justify-between gap-2 flex-wrap text-xs font-medium">
                  <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                    <IoMdMail />
                    <span>{userInfo.email}</span>
                  </div>
                  <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                    <FaPhoneAlt />
                    <span>{userInfo.phone || "Should be added"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full xl:w-2/3 flex flex-col gap-4">
            <Performance />
          </div>
        </div>
        {/* BOTTOM  */}
        <div className="mt-4 bg-white rounded-md  p-4 h-[800px] w-full">
          <h4>Teacher&apos;s Schedule</h4>
          <BigCalendar
            firstName={userInfo.firstName}
            lastName={userInfo.lastName}
          />
        </div>
      </div>
    </AdminLayout>
  );
};
export default TeacherSinglePage;
