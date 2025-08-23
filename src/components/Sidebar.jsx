import { RxDashboard } from "react-icons/rx";
import { MdApartment, MdClass } from "react-icons/md";
import { IoPeopleSharp, IoArrowBack } from "react-icons/io5";
import { PiStudentBold } from "react-icons/pi";
import { HiUserGroup } from "react-icons/hi";
import { GrMoney } from "react-icons/gr";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

const admin = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: RxDashboard,
  },
  {
    title: "Courses",
    url: "/courses",
    icon: MdClass,
  },
  {
    title: "Teachers",
    url: "/teachers",
    icon: PiStudentBold,
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
];
const teacher = [
  {
    title: "Dashboard",
    url: "/profile",
    icon: RxDashboard,
  },
  {
    title: "My Classes",
    url: "/class",
    icon: MdClass,
  },
  {
    title: "Homework",
    url: "/homework",
    icon: MdApartment,
  },
];
function Sidebar() {
  const { userInfo } = useSelector((state) => state.userLogin);
  return (
    <>
      <div className="bg-blue-400 rounded-[10px] py-10 px-7">
        <NavLink to="/">
          <IoArrowBack className="text-white text-[24px] mb-8 ml-[-15px] mt-[-10px]" />
        </NavLink>
        {userInfo.role === "admin"
          ? admin.map((item) => (
              <NavLink
                to={item.url}
                className={({ isActive }) =>
                  isActive ? "active sidebar-item__link" : "sidebar-item__link"
                }
              >
                <item.icon fontSize={30} />
                {item.title}
              </NavLink>
            ))
          : teacher.map((item) => (
              <NavLink
                to={item.url}
                className={({ isActive }) =>
                  isActive ? "active sidebar-item__link" : "sidebar-item__link"
                }
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
