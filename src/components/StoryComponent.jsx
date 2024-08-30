import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import StoryModal from "../components/StoryModal";
import "../style/storycomponent.css";
import storyicon from "../image/story.png";
import defaultpfp from "../image/default-profile.jpg";

export default function StoryComponent() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [userDetails, setUserDetails] = useState({});
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await fetch("http://localhost:5000/story");
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        const data = await response.json();
        setStories(data);

        const userPromises = data.map(async (story) => {
          const userResponse = await fetch(`http://localhost:5000/users/${story.userId}`);
          if (!userResponse.ok) {
            throw new Error(`Network response was not ok: ${userResponse.statusText}`);
          }
          const userData = await userResponse.json();
          return { storyId: story.id, user: userData };
        });

        const users = await Promise.all(userPromises);
        const userDetailsMap = users.reduce((acc, { storyId, user }) => {
          acc[storyId] = user;
          return acc;
        }, {});
        setUserDetails(userDetailsMap);

      } catch (error) {
        console.error("Error fetching stories:", error.message);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, []);

  const handleModalShow = () => setShowModal(true);
  const handleModalClose = () => setShowModal(false);

  const handleStorySubmit = async (formData) => {
    try {
      const response = await fetch("http://localhost:5000/story/stories", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const newStory = await response.json();
        setStories((prevStories) => [newStory, ...prevStories]);
      } else {
        console.error("Image upload failed");
      }
    } catch (error) {
      console.error("Error adding story:", error);
    }
  };

  if (loading) return <div>Loading stories...</div>;
  if (error) return <div>Error fetching stories: {error}</div>;

  return (
    <div className="stories-container d-flex align-items-center">
      <div className="stories-wrapper d-flex overflow-scroll py-2">
        <div className="story-circle_addstory mx-2 add-story" onClick={handleModalShow}>
          <div className="add-story-logo">
            <img src={storyicon} alt="Story" className="story-image" />
          </div>
        </div>

        {stories.length > 0 ? (
          stories.map((story) => {
            const user = userDetails[story.id] || {};
            return (
              <Link key={story.id} to={`/story/${story.id}`} className="text-decoration-none">
                <div className="story-circle mx-2">
                  <img
                    src={user.profilePicture ? user.profilePicture : defaultpfp}
                    alt="User Profile"
                    className="story-image"
                  />
                </div>
                <span className="story-username text-black fw-light">{user.username || "Unknown"}</span>
              </Link>
            );
          })
        ) : (
          <div>No stories available</div>
        )}
      </div>

      <StoryModal
        show={showModal}
        handleClose={handleModalClose}
        handleSubmit={handleStorySubmit}
        userId={userId}
      />
    </div>
  );
}
