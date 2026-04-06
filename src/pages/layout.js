import { useSelector } from "react-redux";
import { Navbar, SearchBar, Sidebar } from "../components";
import NavbarStudent from "../components/navbar/NavbarStudent";
import NavbarTeacher from "../components/navbar/NavbarTeacher";

export default function AdminLayout({ children, hidden, userData }) {
  const { userInfo } = useSelector((state) => state.userLogin);
  // in case if you gonna change navbar
  // : userInfo.role === "admin" && userData.role === "student" ? (
  //       <NavbarStudent userInfoData={userData} />
  //     )
  return (
    <>
      {/* <Navbar /> */}
      {userInfo && userInfo.role === "student" ? (
        <NavbarStudent userInfoData={userInfo} />
      ) : (
        <NavbarTeacher userInfoData={userInfo} />
      )}
      <div className="lg:flex block container gap-4">
        <Sidebar />
        <main className="w-full">
          {/* <SearchBar hidden={hidden} /> */}
          {children}
        </main>
      </div>
    </>
  );
}
