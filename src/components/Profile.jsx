import React from "react";
import { useSelector } from 'react-redux';
function Profile() {
  const { userInfo } = useSelector((state) => state.userLogin);  
  return (
    <div>
      <h1>User Profile</h1>
      <p>
        <strong>ID/Email:</strong> {userInfo.email}
      </p>
      <p>
        <strong>Name:</strong> {userInfo.name}
      </p>
      <p>
        <strong>Surname:</strong> {userInfo.surname}
      </p>
      {/* Render other user details */}
    </div>
  );
}

export default Profile;
