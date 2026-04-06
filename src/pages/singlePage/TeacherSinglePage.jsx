import { BigCalendar } from "../../components";
import FormModal from "../../components/forms/FormModal";
import { useSelector } from "react-redux";
import {
  FaPhoneAlt,
  FaUser,
  FaEnvelope,
  FaClock,
} from "react-icons/fa";
import AdminLayout from "../layout";

const TeacherSinglePage = () => {
  const { userInfo } = useSelector((state) => state.userLogin);
  return (
    <AdminLayout hidden={true}>
      <div className="flex-1 p-6 bg-slate-50/50 min-h-screen">
        {/* TOP SECTION: Profile & Quick Stats */}
        <div className="flex flex-col lg:flex-row gap-6 mb-6">
          {/* Enhanced Profile Card */}
          <div className="flex-[2] bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row gap-8 relative overflow-hidden">
            {/* Decorative Background Element */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full -mr-10 -mt-10 z-0" />

            <div className="relative shrink-0 mx-auto md:mx-0">
              <div className="relative">
                {userInfo.img ? (
                  <img
                    src={userInfo.img}
                    alt="Teacher"
                    className="w-40 h-40 rounded-2xl object-cover shadow-xl border-4 border-white"
                  />
                ) : (
                  <div className="w-40 h-40 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-300 border-4 border-white shadow-lg">
                    <FaUser size={64} />
                  </div>
                )}
                <div className="absolute -bottom-3 -right-3 z-50">
                  <FormModal
                    table="teacher"
                    type="update"
                    data={{ userInfo }}
                  />
                </div>
              </div>
            </div>

            <div className="relative flex flex-col justify-between flex-1 text-center md:text-left">
              <div>
                <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                  <h1 className="text-3xl font-black text-slate-800 tracking-tight">
                    {userInfo.firstName} {userInfo.lastName}
                  </h1>
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-wider">
                    Active
                  </span>
                </div>
                <p className="text-slate-500 text-sm leading-relaxed max-w-md">
                  Senior Educator specializing in English Linguistics. Dedicated
                  to interactive learning and student growth performance.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                <div className="flex items-center gap-3 text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="p-2 bg-white rounded-lg shadow-sm text-indigo-500">
                    <FaEnvelope />
                  </div>
                  <span className="text-xs font-bold truncate">
                    {userInfo.email}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="p-2 bg-white rounded-lg shadow-sm text-indigo-500">
                    <FaPhoneAlt />
                  </div>
                  <span className="text-xs font-bold">
                    {userInfo.phone || "No Phone"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION: The Calendar */}
        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
                <FaClock className="text-indigo-600" />
                Teaching Schedule
              </h2>
              <p className="text-slate-400 text-sm font-medium">
                Weekly lesson distribution and curriculum plans
              </p>
            </div>
          </div>

          <div className="rounded-3xl overflow-hidden border border-slate-50">
            <BigCalendar
              firstName={userInfo.firstName}
              lastName={userInfo.lastName}
            />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default TeacherSinglePage;
