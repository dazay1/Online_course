import React, {
  useCallback,
  useState,
  useRef,
  useEffect,
  useMemo,
} from "react";
import logo from "../../assets/logo.svg";
import star from "../../assets/stars.png";
import { FaUser } from "react-icons/fa";
import { FiLogOut, FiBell } from "react-icons/fi";
import { HiOutlineUser } from "react-icons/hi";
import DropdownItem from "../DropdownItem";
import AttendanceCalendar from "../CalendarAttendance";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearUserInfo } from "../Redux/userSlice";

function NavbarStudent({ userData, userInfoData }) {
  // States
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [starPanelOpen, setStarPanelOpen] = useState(false);
  const [openCalendar, setOpenCalendar] = useState(false);
  const [openNotification, setOpenNotification] = useState(false);
  const [user, setUser] = useState([]);
  const [stars, setStars] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);

  const dropdownRef = useRef(null);
  const starPanelRef = useRef(null);
  const dropdownNot = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userInformation =
    userInfoData.role === "teacher" || userInfoData.role === "admin"
      ? userData
      : userInfoData;

  // Fetch stars
  const fetchStars = useCallback(async () => {
    try {
      const response = await fetch(
        "https://sql-server-nb7m.onrender.com/api/stars",
      );
      const data = await response.json();
      const totalStarsSum = Object.values(data)
        .filter((item) => item.student_id === userInformation.id)
        .reduce(
          (sum, item) =>
            sum + Number(item.bonus || 0) + Number(item.total_stars || 0),
          0,
        );
      const userDataFiltered = Object.values(data).filter(
        (item) => item.student_id === userInformation.id,
      );
      setUser(userDataFiltered);
      setStars(totalStarsSum);
    } catch (error) {
      console.error("Error fetching stars:", error);
    }
  }, [userInformation.id]);

  // Fetch notifications list
  useEffect(() => {
    fetchStars();
  }, [fetchStars]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
      if (starPanelRef.current && !starPanelRef.current.contains(e.target)) {
        setStarPanelOpen(false);
      }
      if (dropdownNot.current && !dropdownNot.current.contains(e.target)) {
        setOpenNotification(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Logout
  const handleLogout = () => {
    dispatch(clearUserInfo());
    navigate("/", { state: { id: userInformation.email } });
  };

  // Months array
  const MONTHS = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Prepare history for stars panel
  const history = (user || []).map((item) => {
    const dateObj = new Date(item.lesson_date);
    const day = String(dateObj.getDate()).padStart(2, "0");
    const monthName = MONTHS[dateObj.getMonth()];
    const year = dateObj.getFullYear();
    const totalStars =
      item.actives + item.homework + item.bonus + item.not_late;
    return {
      date: `${day}-${monthName}-${year}`,
      not_late: item.not_late || 0,
      actives: item.actives || 0,
      homework: item.homework || 0,
      minus: item.minus_stars || 0,
      bonus: item.bonus || 0,
      total: totalStars || 0,
    };
  });
  // Month/year state for star panel
  const [monthYear, setMonthYear] = useState(() => {
    const now = new Date();
    return { month: now.getMonth(), year: now.getFullYear() };
  });

  const filteredHistory = useMemo(() => {
    return history.filter((item) => {
      const [, monthName, itemYear] = item.date.split("-");
      return (
        MONTHS.indexOf(monthName) === monthYear.month &&
        Number(itemYear) === monthYear.year
      );
    });
  }, [history, monthYear]);

  const handlePrevMonth = () =>
    setMonthYear(({ month, year }) =>
      month === 0 ? { month: 11, year: year - 1 } : { month: month - 1, year },
    );

  const handleNextMonth = () =>
    setMonthYear(({ month, year }) =>
      month === 11 ? { month: 0, year: year + 1 } : { month: month + 1, year },
    );

  // Open notifications dropdown
  const handleOpenNotifications = async () => {
    setOpenNotification((prev) => !prev);

    if (!openNotification && unreadCount > 0) {
      try {
        await fetch(
          `https://sql-server-nb7m.onrender.com/api/coin-notifications/mark-as-read`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ studentId: userInformation.id }),
          },
        );
        setUnreadCount(0); // hide badge after reading
      } catch (err) {
        console.error("Error marking notifications as read:", err);
      }
    }
  };
  return (
    <div className="bg-white">
      <div className="max-w-6xl mx-auto flex items-center justify-between p-4">
        <div className="w-[150px]">
          <a href="/">
            <img src={logo} alt="logo" />
          </a>
        </div>

        <div className="flex gap-6 items-center">
          {/* Stars Panel */}
          <div className="relative" ref={starPanelRef}>
            <div
              onClick={() => setStarPanelOpen((prev) => !prev)}
              className="flex gap-3 items-center border-gray-200 border-2 px-3 py-1 rounded-lg cursor-pointer select-none"
            >
              <img src={star} alt="star" className="w-8 h-8" />
              {stars}
            </div>

            <div
              className={`absolute right-0 mt-3 w-96 bg-white rounded-xl shadow-xl border z-30 transition-all duration-300 ease-out origin-top ${starPanelOpen ? "opacity-100 scale-100 translate-y-0 pointer-events-auto" : "opacity-0 scale-95 -translate-y-2 pointer-events-none"}`}
            >
              {/* Month navigation */}
              <div className="px-4 py-3 border-b flex items-center justify-between">
                <button
                  onClick={handlePrevMonth}
                  className="text-gray-400 hover:text-black cursor-pointer select-none"
                >
                  ←
                </button>
                <span className="font-semibold select-none">
                  {MONTHS[monthYear.month]} {monthYear.year}
                </span>
                <button
                  onClick={handleNextMonth}
                  className="text-gray-400 hover:text-black cursor-pointer select-none"
                >
                  →
                </button>
              </div>

              {/* Headers */}
              <div className="grid grid-cols-5 px-4 py-2 border-b bg-gray-50 text-xs text-gray-500 font-semibold select-none">
                <span>Date</span>
                <span className="text-center">Not Late</span>
                <span className="text-center">Actives</span>
                <span className="text-center">Homework</span>
                <span className="text-center">Minus</span>
              </div>

              {/* List */}
              <div className="max-h-72 overflow-y-auto">
                {filteredHistory.length === 0 ? (
                  <div className="px-4 py-6 text-center text-gray-400 text-sm select-none">
                    No records for this month
                  </div>
                ) : (
                  filteredHistory.map((item, idx) => {
                    const notLateColor =
                      item.not_late < 5
                        ? "text-red-500"
                        : item.not_late < 8
                          ? "text-yellow-500"
                          : "text-green-500";
                    const activesColor =
                      item.actives < 6
                        ? "text-red-500"
                        : item.actives < 10
                          ? "text-yellow-500"
                          : "text-green-500";
                    const homeworkColor =
                      item.homework < 10
                        ? "text-red-500"
                        : item.homework < 20
                          ? "text-yellow-500"
                          : "text-green-500";
                    const minusColor = "text-red-500";

                    return (
                      <div
                        key={idx}
                        className="grid grid-cols-5 px-4 py-2 border-b text-sm text-gray-700 select-none"
                      >
                        <span>{item.date.split("-")[0]}</span>
                        <span
                          className={`text-center font-semibold ${notLateColor}`}
                        >
                          {item.not_late}
                        </span>
                        <span
                          className={`text-center font-semibold ${activesColor}`}
                        >
                          {item.actives}
                        </span>
                        <span
                          className={`text-center font-semibold ${homeworkColor}`}
                        >
                          {item.homework}
                        </span>
                        <span
                          className={`text-center font-semibold ${minusColor}`}
                        >
                          {item.minus}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="relative" ref={dropdownNot}>
            <div
              className="relative cursor-pointer"
              onClick={handleOpenNotifications}
            >
              <FiBell size={22} className="text-gray-700" />
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] bg-red-600 text-white text-[11px] flex items-center justify-center rounded-full px-1">
                  {unreadCount}
                </span>
              )}
            </div>

            {openNotification && (
              <div className="absolute top-full right-0 mt-3 w-[380px] bg-white rounded-xl shadow-lg z-20 overflow-hidden">
                {/* Header */}
                <div className="px-5 py-4 border-b">
                  <h4 className="text-lg font-semibold text-gray-900">
                    Bildirishnomalar
                  </h4>
                </div>

                {/* List */}
                <div className="max-h-[360px] overflow-y-auto">
                  {history.length > 0 ? (
                    history.map((item, index) => (
                      <div
                        key={index}
                        className="flex gap-4 px-5 py-4 border-b last:border-b-0 hover:bg-gray-50 transition"
                      >
                        {/* Icon */}
                        <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center shrink-0">
                          <span className="text-xl">🚀</span>
                        </div>

                        {/* Text */}
                        <div className="flex flex-col">
                          <p className="text-[15px] font-semibold text-blue-900">
                            Siz coin oldingiz: {item.total}
                          </p>
                          <span className="text-xs text-gray-400 mt-1">
                            {item.date}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="px-6 py-10 text-center text-gray-400 text-sm">
                      Bildirishnomalar yo‘q
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <div
              onClick={() => setUserDropdownOpen((prev) => !prev)}
              className="cursor-pointer"
            >
              {userInformation.img ? (
                <img
                  src={userInformation.img}
                  alt="user"
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <FaUser className="w-10 h-10 text-lamaPurple" />
              )}
            </div>

            <div
              className={`absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.15)] transition-all duration-300 ease-out z-10 ${userDropdownOpen ? "opacity-100 scale-100 visible" : "opacity-0 scale-95 invisible"}`}
            >
              <div className="flex items-center gap-3 p-4 border-b">
                {userInformation.img ? (
                  <img
                    src={userInformation.img}
                    alt="user"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <FaUser className="w-10 h-10 text-lamaPurple" />
                )}
                <div>
                  <p className="font-medium text-gray-700">
                    {userInformation.firstName} {userInformation.lastName}
                  </p>
                  <a href="/profile/edit" className="text-orange-500 hover:underline text-[12px]">
                    PROFILE
                  </a>
                </div>
              </div>

              <div className="p-2">
                <div onClick={() => setOpenCalendar(true)}>
                  <DropdownItem icon={<HiOutlineUser />} text="Davomat" />
                </div>
                <div onClick={handleLogout}>
                  <DropdownItem
                    icon={<FiLogOut />}
                    text="Platformadan chiqish"
                    danger
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar Modal */}
      {openCalendar && (
        <div className="fixed inset-0 z-50 bg-black/30 overflow-y-auto">
          <div className="min-h-screen flex items-start justify-center py-10">
            <AttendanceCalendar />
            <button
              onClick={() => setOpenCalendar(false)}
              className="fixed top-6 right-6 text-white text-2xl"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default NavbarStudent;
