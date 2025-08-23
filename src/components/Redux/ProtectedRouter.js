import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet} from "react-router-dom";

// public protection
function ProtectedRouter() {
  const { userInfo } = useSelector((state) => state.userLogin);
  return userInfo?.token ? <Outlet /> : <Navigate to="/login" />;
}

function AdminProtectedRouter() {
  const { userInfo } = useSelector((state) => state.userLogin);
  const admin = userInfo?.role === "admin";
  const student = userInfo?.role === "student";
  
  return userInfo?.token ? (
    admin ? (
      <Outlet />
    ) : student ? (
      <Navigate to="/profile" />
    ) : (
      <Navigate to="/login" />
    )
  ) : (
    <Navigate to="/login" />
  );
}
function TeacherProtectedRouter() {
  const { userInfo } = useSelector((state) => state.userLogin);
  const admin = userInfo?.role === "admin";
  const teacher = userInfo?.role === "teacher";
  
  return userInfo?.token ? (
    teacher ? (
      <Outlet />
    ) : admin ? (
      <Navigate to="/admin" />
    ) : (
      <Navigate to="/login" />
    )
  ) : (
    <Navigate to="/login" />
  );
}
export { ProtectedRouter, AdminProtectedRouter, TeacherProtectedRouter };
