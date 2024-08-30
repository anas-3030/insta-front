import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import "../style/storyviewer.css";
import defaultPfp from "../image/default-profile.jpg";

export default function StoryViewer() {
  const { storyId } = useParams();
  const navigate = useNavigate();
  const [stories, setStories] = useState([]);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const containerRef = useRef(null);

  // Fetch all stories and determine the current story index
  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await fetch(`http://localhost:5000/story`);
        if (!response.ok) {
          throw new Error('Failed to fetch stories');
        }
        const storiesData = await response.json();
        setStories(storiesData);

        const index = storiesData.findIndex(story => story.id === parseInt(storyId));
        if (index === -1) {
          throw new Error('Story not found');
        }
        setCurrentStoryIndex(index);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, [storyId]);

  // Fetch user data based on the current story's userId
  useEffect(() => {
    const fetchUserData = async () => {
      if (currentStoryIndex === null || stories.length === 0) return;

      const currentStory = stories[currentStoryIndex];
      if (!currentStory || !currentStory.userId) {
        setUser(null);
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/users/${currentStory.userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        const userData = await response.json();
        setUser(userData);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchUserData();
  }, [currentStoryIndex, stories]);

  // Handle navigation to the next story
  const handleNextStory = () => {
    if (currentStoryIndex < stories.length - 1) {
      const nextStoryId = stories[currentStoryIndex + 1].id;
      navigate(`/story/${nextStoryId}`);
    }
  };

  // Handle navigation to the previous story
  const handlePrevStory = () => {
    if (currentStoryIndex > 0) {
      const prevStoryId = stories[currentStoryIndex - 1].id;
      navigate(`/story/${prevStoryId}`);
    }
  };

  // Handle click outside the story container to navigate home
  const handleClickOutside = (event) => {
    if (containerRef.current && !containerRef.current.contains(event.target)) {
      navigate('/');
    }
  };

  // Add and clean up the event listener for clicks outside
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (loading) return <div>Loading story...</div>;
  if (error) return <div>Error: {error}</div>;
  if (currentStoryIndex === null) return <div>Story not found</div>;

  return (
    <div className="story-viewer">
      <div className="story-container" ref={containerRef}>
        {user && (
          <div className="story-user-info">
            <img
              src={user.profilePicture ? `http://localhost:5000/uploads/${user.profilePicture}` : defaultPfp}
              alt={`${user.username}'s profile`}
              className="story-user-pic"
            />
            <span className="story-username">{user.username}</span>
          </div>
        )}

        {currentStoryIndex > 0 && (
          <div className="story-side left" onClick={handlePrevStory}>
            <img
              src={stories[currentStoryIndex - 1].imageUrl}
              alt="Previous story"
              className="story-image-side"
            />
          </div>
        )}

        <div className="story-main">
          <img
            src={stories[currentStoryIndex].imageUrl}
            alt="Current story"
            className="story-image-main"
          />
        </div>

        {currentStoryIndex < stories.length - 1 && (
          <div className="story-side right" onClick={handleNextStory}>
            <img
              src={stories[currentStoryIndex + 1].imageUrl}
              alt="Next story"
              className="story-image-side"
            />
          </div>
        )}
      </div>
    </div>
  );
}
