import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

// public protection
function ProtectedRouter() {
  const { userInfo } = useSelector((state) => state.userLogin);
  // console.log(userInfo?.token);
  return userInfo?.token ? <Outlet /> : <Navigate to="/login" />;
}

export default ProtectedRouter;