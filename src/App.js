import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Login, NotFound, SignUp, Admin } from "./components/index";
import {
  Home,
  About,
  Courses,
  Pricing,
  CourseOpen,
  Teachers,
  TeachersPage,
  Students,
  StudentPage,
  TeacherSinglePage,
  Class,
  ClassPage,
  Attendance,
  Payment,
} from "./pages/index";
import {
  ProtectedRouter,
  AdminProtectedRouter,
} from "./components/Redux/ProtectedRouter";
import "./App.css";
import { useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import the CSS for toast notifications
import { SimpleHomework, SimpleSentence1, SimpleVideo } from "./pages/homework/PresentSimple";

function App() {
  const { userInfo } = useSelector((state) => state.userLogin);
  const role = userInfo?.role;
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/price" element={<Pricing />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFound />} />
          {/* ********** PRIVATE PUBLIC ROUTES ********** */}
          <Route element={<ProtectedRouter />}>
            {role === "student" ? (
              <Route path="/profile" element={<StudentPage />} />
            ) : role === "teacher" ? (
              <Route path="/profile" element={<TeacherSinglePage />} />
            ) : (
              <Route path="/profile" element={<Login />} />
            )}
            <Route path="/course" element={<CourseOpen />} />
            <Route path="/simple/video" element={<SimpleVideo />} />
            <Route path="/simple/homework" element={<SimpleHomework />} />
            <Route path="/simple/homework=tasks1" element={<SimpleSentence1 />} />
            {/* ********** TEACHER ROUTES ********** */}
            {role === "teacher" ? (
              <>
                <Route path="/class" element={<ClassPage />} />
                <Route path="/attendance" element={<Attendance />} />
              </>
            ) : null}
            {/* ********** ADMIN ROUTES ********** */}
            <Route element={<AdminProtectedRouter />}>
              <Route path="/admin" element={<Admin />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/teachers" element={<Teachers />} />
              <Route path="/students" element={<Students />} />
              <Route path="/teachers/:id" element={<TeachersPage />} />
              <Route path="/students/:id" element={<StudentPage />} />
              <Route path="/groups" element={<Class />} />
              <Route path="/groups/:id" element={<ClassPage />} />
              <Route path="/attendance/:id" element={<Attendance />} />
            </Route>
          </Route>
        </Routes>
        <ToastContainer position="bottom-right" theme="dark" />
        {/* <Footer /> */}
      </Router>
    </>
  );
}

export default App;
