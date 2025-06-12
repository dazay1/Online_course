import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function UserPage() {
  const { id } = useParams(); // 'id' will be the email or user ID from the URL
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log('Hello');
  
  useEffect(() => {
    async function fetchUser() {
      try {
        setLoading(true);
        setError(null);
        // Replace this URL with your real API endpoint
        const response = await fetch(`/api/users/${encodeURIComponent(id)}`);
        console.log(response);
        
        if (!response.ok) throw new Error("Failed to fetch user info");
        const data = await response.json();
        setUserInfo(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [id]);

  if (loading) return <div>Loading user information...</div>;
  if (error) return <div>Error: {error}</div>;

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

export default UserPage;
