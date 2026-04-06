import { useParams } from "react-router-dom";
import { BigCalendar, Performance } from "../../components";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  FaUser,
  FaTrophy,
  FaMedal,
  FaCrown,
  FaStar,
  FaRocket,
} from "react-icons/fa";
import AdminLayout from "../layout";
import { toast } from "react-toastify";

const TeachersPage = () => {
  const { userInfo } = useSelector((state) => state.userLogin);
  const [filteredGroups, setFilteredGroups] = useState([]);

  useEffect(() => {
    const getUsersById = async () => {
      try {
        const groupRes = await fetch(
          "https://sql-server-nb7m.onrender.com/api/group",
        );
        const starsRes = await fetch(
          "https://sql-server-nb7m.onrender.com/api/stars",
        );
        const starsData = await starsRes.json();
        const groupData = await groupRes.json();

        const [classPart1, classPart2] = userInfo?.name.split(" ") || [];
        const filtered = groupData.filter(
          (g) =>
            (g.name === classPart1 || g.name === classPart2) &&
            g.role === "student",
        );

        const updatedGroups = filtered.map((student) => {
          const studentStars = starsData.filter(
            (star) => Number(star.student_id) === Number(student.id),
          );
          const totalStars = studentStars.reduce(
            (sum, curr) =>
              sum + (Number(curr.total_stars) + Number(curr.bonus) || 0),
            0,
          );
          return { ...student, totalStars };
        });

        setFilteredGroups(updatedGroups);
      } catch (error) {
        toast.error("Server error, please try again");
      }
    };
    getUsersById();
  }, [userInfo]);

  const sortedGroups = [...filteredGroups].sort(
    (a, b) => b.totalStars - a.totalStars,
  );

  const topThree = [
    {
      ...sortedGroups[0],
      rank: 1,
      icon: <FaCrown className="text-yellow-400" />,
      color: "border-yellow-200 bg-yellow-50 shadow-yellow-100",
    },
    {
      ...sortedGroups[1],
      rank: 2,
      icon: <FaMedal className="text-slate-400" />,
      color: "border-indigo-100 bg-indigo-50 shadow-indigo-100",
    },
    {
      ...sortedGroups[2],
      rank: 3,
      icon: <FaMedal className="text-orange-400" />,
      color: "border-orange-100 bg-orange-50 shadow-orange-100",
    },
  ];

  const others = sortedGroups.slice(3);

  return (
    <AdminLayout hidden={true} userInfo={userInfo}>
      <div className="flex flex-col xl:flex-row gap-2 p-4 md:p-8 min-h-screen bg-[#f8fafc]">
        {/* LEADERBOARD SECTION */}
        <div className="flex-1 w-full bg-white rounded-[2rem] md:rounded-[3rem] shadow-[0_20px_50px_rgba(79,70,229,0.1)] border-4 border-white overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-br from-indigo-700 via-purple-700 to-fuchsia-700 py-8 md:py-12 px-4 text-center relative">
            <div className="relative z-10">
              <h1 className="text-2xl md:text-4xl font-black text-white flex items-center justify-center gap-3 md:gap-4 drop-shadow-md uppercase tracking-tight">
                <FaRocket className="text-yellow-300 animate-pulse text-xl md:text-3xl" />
                Champions League
                <FaRocket className="text-yellow-300 animate-pulse text-xl md:text-3xl" />
              </h1>
              <p className="text-indigo-100 font-bold mt-2 opacity-90 uppercase text-[10px] md:text-xs tracking-[0.2em]">
                Top performers
              </p>
            </div>
          </div>

          <div className="p-4 md:p-8">
            {/* THE PODIUM - Responsive Stack (1st place first on mobile) */}
            <div className="flex flex-col md:flex-row justify-center items-center md:items-end gap-10 md:gap-6 lg:gap-8 mb-16 pt-12 md:pt-16">
              {/* Order changed for mobile: 1st, then 2nd, then 3rd */}
              <div className="order-2 md:order-1">
                <PodiumCard
                  student={topThree[1]}
                  size="w-40 h-56 md:w-44 md:h-60"
                  rankText="2nd"
                />
              </div>
              <div className="order-1 md:order-2">
                <PodiumCard
                  student={topThree[0]}
                  size="w-48 h-64 md:w-56 md:h-80"
                  isWinner={true}
                  rankText="1st"
                />
              </div>
              <div className="order-3 md:order-3">
                <PodiumCard
                  student={topThree[2]}
                  size="w-40 h-56 md:w-44 md:h-60"
                  rankText="3rd"
                />
              </div>
            </div>

            {/* OTHERS LIST */}
            <div className="max-w-2xl mx-auto space-y-4 pb-10">
              <div className="flex items-center justify-between px-2 mb-4">
                <h3 className="text-indigo-900 font-black text-xs md:text-sm uppercase tracking-widest">
                  The Contenders
                </h3>
                <span className="hidden sm:inline-block text-[10px] font-bold text-indigo-400 uppercase bg-indigo-50 px-3 py-1 rounded-full">
                  {sortedGroups.length} Students
                </span>
              </div>

              {others.map((student, index) => (
                <div
                  key={student.id}
                  className="group bg-indigo-50/30 rounded-2xl md:rounded-[2rem] p-4 md:p-5 flex items-center justify-between border-2 border-white shadow-sm hover:border-purple-300 hover:bg-white transition-all duration-300"
                >
                  <div className="flex items-center gap-3 md:gap-5">
                    <div className="w-8 h-8 md:w-10 md:h-10 shrink-0 rounded-full bg-indigo-600 flex items-center justify-center text-white font-black text-xs md:text-base">
                      {index + 4}
                    </div>
                    <div className="relative shrink-0">
                      {student.img ? (
                        <img
                          src={student.img}
                          className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl object-cover border-2 md:border-4 border-white shadow-md"
                          alt=""
                        />
                      ) : (
                        <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-white flex items-center justify-center border-2 md:border-4 border-white shadow-md">
                          <FaUser className="text-teal-300 text-xl md:text-3xl" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-black text-indigo-900 text-sm md:text-xl truncate">
                        {student.firstName} {student.lastName}
                      </p>
                      <p className="text-[10px] md:text-sm font-extrabold text-fuchsia-500">
                        {student.totalStars?.toLocaleString()} XP
                      </p>
                    </div>
                  </div>

                  {/* Progress bar hidden on very small phones */}
                  <div className="hidden md:block">
                    <div className="h-2 w-16 lg:w-24 bg-indigo-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-500 rounded-full"
                        style={{ width: "60%" }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* PERFORMANCE SIDEBAR */}
        <div className="w-full xl:w-[350px] shrink-0">
          <div className="lg:sticky lg:top-8">
            <div className="rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(79,70,229,0.1)]">
              <Performance />
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

// PODIUM CARD COMPONENT (Mobile Optimized)
const PodiumCard = ({ student, size, isWinner, rankText }) => {
  if (!student?.id && !student?.firstName)
    return (
      <div
        className={`${size} opacity-20 border-dashed border-2 border-indigo-200 rounded-[2rem] flex items-center justify-center`}
      >
        <span className="text-[10px] font-bold text-indigo-300 uppercase">
          Empty Slot
        </span>
      </div>
    );

  return (
    <div
      className={`relative ${size} ${student.color} rounded-[2rem] md:rounded-[3rem] border-4 flex flex-col items-center justify-center p-4 md:p-6 transition-all duration-500 hover:-translate-y-2 shadow-xl`}
    >
      <div className="absolute -top-10 md:-top-20 text-4xl md:text-6xl drop-shadow-md">
        {student.icon}
      </div>

      <div className="relative mb-3 md:mb-4">
        <div
          className={`rounded-2xl md:rounded-[2rem] overflow-hidden border-2 md:border-4 border-white shadow-xl ${isWinner ? "w-20 h-20 md:w-28 md:h-28" : "w-16 h-16 md:w-24 md:h-24"}`}
        >
          {student.img ? (
            <img
              src={student.img}
              className="w-full h-full object-cover"
              alt=""
            />
          ) : (
            <div className="w-full h-full bg-white flex items-center justify-center">
              <FaUser className="text-teal-300 text-2xl md:text-4xl" />
            </div>
          )}
        </div>
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white px-3 py-0.5 md:py-1 rounded-full shadow-md border border-indigo-50">
          <span className="text-[8px] md:text-[10px] font-black text-indigo-600 uppercase tracking-widest">
            {rankText}
          </span>
        </div>
      </div>

      <h3
        className={`font-black text-indigo-950 text-center leading-tight mb-2 truncate max-w-full ${isWinner ? "text-sm md:text-xl" : "text-[10px] md:text-sm"}`}
      >
        {student.firstName} <br className="hidden md:block" />{" "}
        {student.lastName}
      </h3>

      <div className="bg-indigo-600 px-3 md:px-4 py-1 rounded-xl md:rounded-2xl shadow-lg shadow-indigo-100">
        <p className="text-[10px] md:text-xs font-black text-white italic whitespace-nowrap">
          {student.totalStars?.toLocaleString()} PTS
        </p>
      </div>
    </div>
  );
};

export default TeachersPage;
