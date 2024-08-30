import React, { useState, useEffect } from 'react';
import PostModal from './PostModal'; // Adjust the path as necessary
import '../style/Explore.css'; // Ensure this path is correct for your project

const Explore = () => {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [modalShow, setModalShow] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('http://localhost:5000/posts');
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);

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
          {posts.length > 0 ? (
            <div className="explore__posts__container">
              {posts.map((post) => (
                <div className="post" key={post.id} onClick={() => openPost(post)}>
                  <img
                    src={post.imageUrl}
                    alt={`Post ${post.id}`}
                    className="post-image"
                  />
                </div>
              ))}
            </div>
          ) : (
            <p>No posts available.</p>
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

export default Explore;
