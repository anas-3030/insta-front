import React, { useEffect, useState } from "react";
import "../style/Suggest.css";
import "../style/allstyle.css";
import defaultpfp from "../image/default-profile.jpg"; // Import default profile picture

export default function Suggestions() {
  const [user, setUser] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    // Fetch current user information from local storage
    const userId = localStorage.getItem("userId");

    if (userId) {
      fetch(`http://localhost:5000/users/${userId}`)
        .then((response) => response.json())
        .then((data) => setUser(data))
        .catch((error) => console.error("Error fetching user data:", error));
    }

    // Fetch suggestions (limit to 7 users)
    fetch("http://localhost:5000/user")
      .then((response) => response.json())
      .then((data) => setSuggestions(data.slice(0, 7))) // Limit to 7 users
      .catch((error) => console.error("Error fetching suggestions:", error));
  }, []);

  if (!user) return <div>Loading...</div>;

  return (
    <div className="col-12 col-md-4 col-lg-12 suggestions-container border-left p-0 p-md-3">
      {/* Current User Section */}
      <div className="user-profile my-3">
        <div className="d-flex align-items-center mb-3">
          <img
            src={user.profilePicture ?user.profilePicture : defaultpfp}
            alt="Profile"
            className="profile-pic"
          />
          <div className="ml-2">
            <span className="username fw-semibold">{user.username}</span>
            <a href="#" className="switch">Switch</a>
          </div>
        </div>
      </div>

      {/* Suggestions Section */}
      <div className="suggestions">
        <h6 className="mb-3 fs-14" style={{ color: "#737373" }}>Suggested for you</h6>

        {suggestions.length > 0 ? (
          suggestions.map((suggestion) => (
            <div key={suggestion.id} className="suggestion d-flex align-items-center mb-2">
              <img
                src={suggestion.profilePicture ? suggestion.profilePicture : defaultpfp}
                alt={`Suggested ${suggestion.username}`}
                className="suggestion-pic"
              />
              <div className="ml-2">
                <span className="suggestion-username fw-semibold">{suggestion.username}</span>
                <span className="suggestion-info">Suggested for you</span>
              </div>
              <a href="#" className="ml-auto follow">Follow</a>
            </div>
          ))
        ) : (
          <div>No suggestions available</div>
        )}

        <a href="#" className="see-all">See All</a>
      </div>

      <div className="row border-top py-2">
        <div className="col-lg-12 text-center fs-12" style={{ color: "#C7C7C7" }}>
          <p className="mb-0">
            About · Help · Press · API · Jobs · Privacy · Terms · Locations · Language
          </p>
          <p className="mb-0">© 2024 INSTAGRAM FROM META</p>
        </div>
      </div>
    </div>
  );
}
