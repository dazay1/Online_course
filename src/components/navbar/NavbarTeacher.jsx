import React, { useEffect, useRef, useState } from "react";
import logo from "../../assets/logo.svg";
import DropdownItem from "../DropdownItem";
import { FaUser } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearUserInfo } from "../Redux/userSlice";
import { HiOutlineUser } from "react-icons/hi2";
function NavbarTeacher({ userInfoData }) {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const handleLogout = () => {
    dispatch(clearUserInfo());
    navigate("/", { state: { id: userInfoData.email } });
  };

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutsideUserDropdown = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutsideUserDropdown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideUserDropdown);
    };
  }, []);

  return (
    <div className="bg-white">
      <div className="max-w-6xl mr-auto ml-auto flex items-center justify-between p-4">
        <div className="w-[150px]">
          <a href="/">
            <img src={logo} alt="logo" />
          </a>
        </div>
        <div className="flex gap-6 items-center">
          <div>Notification</div>
          {/* User Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <div
              onClick={() => setUserDropdownOpen((prev) => !prev)}
              className="cursor-pointer"
            >
              {userInfoData.img ? (
                <img
                  src={userInfoData.img}
                  alt="user"
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <FaUser className="w-10 h-10 text-lamaPurple" />
              )}
            </div>

            <div
              className={`absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.15)] transition-all duration-300 ease-out z-10
              ${userDropdownOpen ? "opacity-100 scale-100 visible" : "opacity-0 scale-95 invisible"}
              `}
            >
              {/* User Info */}
              <div className="flex items-center gap-3 p-4 border-b">
                {userInfoData.img ? (
                  <img
                    src={userInfoData.img}
                    alt="user"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <FaUser className="w-10 h-10 text-lamaPurple" />
                )}
                <div>
                  <p className="font-medium text-gray-700">
                    {userInfoData.firstName} {userInfoData.lastName}
                  </p>
                  <p className="font-medium text-red-600 text-[10px] uppercase">
                    {userInfoData.role}
                  </p>
                </div>
              </div>

              {/* Menu Items */}
              <div className="p-2">
                <div>
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
    </div>
  );
}

export default NavbarTeacher;
