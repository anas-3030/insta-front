import React, { useState, useEffect } from 'react';
import PostModal from './PostModal'; // Adjust the path as necessary
import '../style/Explore.css'; // Ensure this path is correct for your project

const SavedPostsPage = () => {
  const [savedPosts, setSavedPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [modalShow, setModalShow] = useState(false);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchSavedPosts = async () => {
      try {
        const response = await fetch(`http://localhost:5000/users/${userId}/saved-posts`);
        if (!response.ok) {
          throw new Error('Failed to fetch saved posts');
        }
        const data = await response.json();
        setSavedPosts(data);
      } catch (error) {
        console.error('Error fetching saved posts:', error);
      }
    };

    fetchSavedPosts();
  }, [userId]);

  const openPost = (post) => {
    setSelectedPost(post);
    setModalShow(true);
  };

  const closePost = () => {
    setSelectedPost(null);
    setModalShow(false);
  };

  return (
    <div className="explore">
      <div className="container">
        <div className="explore__posts">
          {savedPosts.length > 0 ? (
            <div className="explore__posts__container">
              {savedPosts.map((post) => (
                <div className="post" key={post.id} onClick={() => openPost(post)}>
                  <img
                    src={`http://localhost:5000/${post.imageUrl}`}
                    alt={`Post ${post.id}`}
                    className="post-image"
                  />
                </div>
              ))}
            </div>
          ) : (
            <p>No saved posts available.</p>
          )}
        </div>

        <PostModal
          show={modalShow}
          handleClose={closePost}
          post={selectedPost}
        />
      </div>
    </div>
  );
};

export default SavedPostsPage;
