// AuthButtons.js
import React, { useState } from "react";

function Profile() {
  const [isAuthorized, setIsAuthorized] = useState(false);

  const handleLogin = () => {
    setIsAuthorized(true);
  };

  const handleSignup = () => {
    setIsAuthorized(true);
  };

  return (
    <div>
      {isAuthorized ? (
        <button>Profile</button>
      ) : (
        <div className="navbar-button">
          <a href="/sign-up">
            <button className="navbar-button-1">Getting Started</button>
          </a>
        </div>
      )}
    </div>
  );
}

export default Profile;
