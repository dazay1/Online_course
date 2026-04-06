import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Login, NotFound, SignUp, Admin, Grade } from "./components/index";
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
  // ClassPage,
  Attendance,
  Payment,
  HomeworkList,
  HomeworkDetail,
  CreateHomeworkWithExercises,
  TeacherHomeworkList,
  TeacherHomeworkDetails,
  TeacherSubmissions,
  StudentProfile,
  TeacherPlan,
  StudentPlan,
  AdminShopping,
  StudentShopping,
} from "./pages/index";
import {
  ProtectedRouter,
  AdminProtectedRouter,
} from "./components/Redux/ProtectedRouter";
import "./App.css";
import { useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import the CSS for toast notifications

function App() {
  const { userInfo } = useSelector((state) => state.userLogin);
  const role = userInfo?.role;
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFound />} />
          {/* ********** PRIVATE PUBLIC ROUTES ********** */}
          <Route element={<ProtectedRouter />}>
            {role === "student" ? (
              <>
                <Route path="/profile" element={<StudentPage />} />
                <Route path="/profile/edit" element={<StudentProfile />} />
                <Route path="/homework" element={<HomeworkList />} />
                <Route path="/homework/:homeworkId" element={<HomeworkDetail />} />
                <Route path="/plan" element={<StudentPlan />} />
                <Route path="/student/shop" element={<StudentShopping />} />
              </>
            ) : role === "teacher" ? (
              <>
                <Route path="/teacher/homework" element={<TeacherHomeworkList />} />
                <Route path="/teacher/homework/:id" element={<TeacherHomeworkDetails />} />
                <Route path="/teacher/homework/:id/submissions" element={<TeacherSubmissions />} />
                <Route path="/teacher/homework/create" element={<CreateHomeworkWithExercises />} />
                {/* <Route path="/teacher/homework/:id/edit" element={<EditHomework />} /> */}
                <Route path="/profile" element={<TeacherSinglePage />} />
              </>
            ) : (
              <Route path="/profile" element={<Login />} />
            )}
            <Route path="/course" element={<CourseOpen />} />
            {/* ********** TEACHER ROUTES ********** */}
            {role === "teacher" ? (
              <>
                {/* <Route path="/class" element={<ClassPage />} /> */}
                <Route path="/attendance" element={<Attendance />} />
                <Route path="/grade" element={<Grade />} />
                <Route path="/plan" element={<TeacherPlan />} />
              </>
            ) : null}
            {/* ********** ADMIN ROUTES ********** */}
            <Route element={<AdminProtectedRouter />}>
              <Route path="/admin" element={<Admin />} />
              <Route path="/payment" element={<Payment />} />
              {/* <Route path="/teachers" element={<Teachers />} /> */}
              <Route path="/students" element={<Students />} />
              <Route path="/teachers/:id" element={<TeachersPage />} />
              <Route path="/students/:id" element={<StudentPage />} />
              <Route path="/groups" element={<Class />} />
              {/* <Route path="/groups/:id" element={<ClassPage />} /> */}
              <Route path="/attendance/:id" element={<Attendance />} />
              <Route path="/grade/:id" element={<Grade />} />
              <Route path="/shopping" element={<AdminShopping />} />
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
