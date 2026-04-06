import { RxDashboard } from "react-icons/rx";
import { MdApartment, MdClass, MdStore } from "react-icons/md";
import { IoPeopleSharp, IoArrowBack } from "react-icons/io5";
import { HiUserGroup } from "react-icons/hi";
import { GrMoney, GrFormSchedule, GrSchedule } from "react-icons/gr";
import { Link, NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState } from "react";
import { HiBars3BottomLeft } from "react-icons/hi2";
import { CgClose } from "react-icons/cg";

const admin = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: RxDashboard,
  },
  {
    title: "Groups",
    url: "/groups",
    icon: HiUserGroup,
  },
  {
    title: "Students",
    url: "/students",
    icon: IoPeopleSharp,
  },
  {
    title: "Payments",
    url: "/payment",
    icon: GrMoney,
  },
  {
    title: "Store",
    url: "/shopping",
    icon: MdStore,
  }
];

const teacher = [
  {
    title: "Dashboard",
    url: "/profile",
    icon: RxDashboard,
  },
  {
    title: "My Classes",
    url: "/attendance",
    icon: MdClass,
  },
  {
    title: "Homework",
    url: "/teacher/homework",
    icon: MdApartment,
  },
  {
    title: "Plan",
    url: "/plan",
    icon: GrFormSchedule,
  },
];
const student = [
  {
    title: "Dashboard",
    url: "/profile",
    icon: RxDashboard,
  },
  {
    title: "Homework",
    url: "/homework",
    icon: MdApartment,
  },
  {
    title: "Study Plan",
    url: "/plan",
    icon: GrFormSchedule,
  },
  {
    title: "Store",
    url: "/student/shop",
    icon: MdStore,
  },
];
function Sidebar() {
  const { userInfo } = useSelector((state) => state.userLogin);
  const [showNav, setShownNav] = useState(false);
  const navOpen = showNav ? "translate-x-0" : "translate-x-[-100%]";
  const showNavHandler = () => setShownNav(true);
  const hideNavHandler = () => setShownNav(false);
  const id = userInfo ? userInfo.id : undefined;

  return (
    <>
      {/* Toggle Button for Mobile View */}
      <div className="lg:hidden">
        <HiBars3BottomLeft onClick={showNavHandler} className="text-blue-400 text-3xl cursor-pointer" />
      </div>
      {/* Sidebar */}
      <div className={`py-3 absolute top-0 left-0 h-full transition-transform duration-300 ${navOpen} lg:translate-x-0 lg:relative lg:block lg:h-auto lg:w-auto lg:py-3`}>
        <CgClose onClick={hideNavHandler} className="text-white text-2xl cursor-pointer lg:hidden absolute top-4 right-4" />
        {userInfo.role === "admin"
          ? admin.map((item, index) => (
              <NavLink
                key={index}
                to={item.url}
                className={({ isActive }) =>
                  isActive ? "active sidebar-item__link" : "sidebar-item__link"
                }
                onClick={hideNavHandler}
              >
                <item.icon fontSize={30} />
                {item.title}
              </NavLink>
            ))
          : userInfo.role === "teacher"
            ? teacher.map((item) => (
                <NavLink
                  key={item.title}
                  to={item.url}
                  className={({ isActive }) =>
                    isActive ? "active sidebar-item__link" : "sidebar-item__link"
                }
                onClick={hideNavHandler}
              >
                <item.icon fontSize={30} />
                {item.title}
              </NavLink>
            )) : student.map((item) => (
                <NavLink
                  key={item.title}
                  to={item.url}
                  className={({ isActive }) =>
                    isActive ? "active sidebar-item__link" : "sidebar-item__link"
                }
                onClick={hideNavHandler}
              >
                <item.icon fontSize={30} />
                {item.title}
              </NavLink>
            ))}
      </div>
    </>
  );
}

export default Sidebar;
