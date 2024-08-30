import React, { useEffect, useState } from "react";
import { Container, Row, Col, Image, Button, Form } from "react-bootstrap";
import "../style/allstyle.css";
import "../style/Mainpage.css";
import defaultpfp from "../image/default-profile.jpg";
import likeIcon from "../image/heart.png";
import likedIcon from "../image/heart (1).png";
import commentIcon from "../image/chat.png";
import shareIcon from "../image/send.png";
import io from 'socket.io-client';
import PostModal from './PostModal'; // Import the PostModal component

const socket = io('http://localhost:5000');

const MainPage = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [activePostId, setActivePostId] = useState(null); // Track active post for showing comments input
  const [newComment, setNewComment] = useState("");
  const [showModal, setShowModal] = useState(false); // State to control the modal
  const [selectedPost, setSelectedPost] = useState(null); // Track which post is selected for the modal

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (userId) {
      const fetchUser = async () => {
        try {
          const response = await fetch(`http://localhost:5000/users/${userId}`);
          const data = await response.json();
          setUser(data);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };
      fetchUser();
    }
  }, [userId]);

  useEffect(() => {
    const fetchPostsAndLikes = async () => {
      try {
        const response = await fetch(`http://localhost:5000/posts`);
        const postsData = await response.json();

        if (Array.isArray(postsData)) {
          const updatedPosts = await Promise.all(
            postsData.map(async (post) => {
              const [likeStatusResponse, likeCountResponse, commentsResponse] = await Promise.all([
                fetch(`http://localhost:5000/like/posts/${post.id}/like/status?userId=${userId}`),
                fetch(`http://localhost:5000/like/posts/${post.id}/like/count`),
                fetch(`http://localhost:5000/comments/posts/${post.id}/specomments`)
              ]);

              const [likeStatusData, likeCountData, commentsData] = await Promise.all([
                likeStatusResponse.json(),
                likeCountResponse.json(),
                commentsResponse.json()
              ]);

              return {
                ...post,
                liked: likeStatusData.liked || false,
                likes: likeCountData.likeCount || 0,
                comments: commentsData
              };
            })
          );
          setPosts(updatedPosts);
        } else {
          setPosts([]);
        }
      } catch (error) {
        console.error("Error fetching posts or like status:", error);
      }
    };

    fetchPostsAndLikes();

    socket.on('new-comment', ({ postId, comment }) => {
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? { ...post, comments: [...post.comments, comment] }
            : post
        )
      );
    });

    return () => {
      socket.off('new-comment');
    };
  }, [userId, token]);

  const handleLike = async (postId) => {
    try {
      const response = await fetch(`http://localhost:5000/like/posts/${postId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        throw new Error('Failed to like post');
      }

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? { ...post, liked: true, likes: post.likes + 1 }
            : post
        )
      );
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleUnlike = async (postId) => {
    try {
      const response = await fetch(`http://localhost:5000/like/posts/${postId}/like`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        throw new Error('Failed to unlike post');
      }

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? { ...post, liked: false, likes: post.likes - 1 }
            : post
        )
      );
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleCommentChange = (event) => {
    setNewComment(event.target.value);
  };

  const handleCommentSubmit = async (postId) => {
    try {
      const response = await fetch(`http://localhost:5000/comments/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, commentText: newComment }),
      });

      if (!response.ok) {
        throw new Error('Failed to post comment');
      }

      socket.emit('new-comment', { postId, comment: { userId, commentText: newComment } });
      setNewComment("");
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleShowModal = (post) => {
    setSelectedPost(post);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPost(null);
  };

  if (!user) return <div>Loading user information...</div>;

  return (
    <Container fluid className="px-3">
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={8}>
          {Array.isArray(posts) && posts.length > 0 ? (
            posts.map((post) => (
              <div key={post.id} className="post bg-white p-3 rounded mb-3">
                <div className="d-flex align-items-center mb-3">
                  <Image
                    src={
                      post.User?.profilePicture
                        ? post.User.profilePicture
                        : defaultpfp
                    }
                    roundedCircle
                    fluid
                    style={{
                      width: "40px",
                      height: "40px",
                      objectFit: "cover",
                    }}
                  />
                  <p className="mb-0 ml-2 fw-semibold" style={{ marginLeft: "10px", fontSize: "14px" }}>
                    {post.User?.username || "Unknown User"}
                  </p>
                </div>

                <div className="post-image-container">
                  <Image src={post.imageUrl} fluid />
                </div>

                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <Button
                      variant="link"
                      className="text-dark p-0 mr-3"
                      onClick={() => post.liked ? handleUnlike(post.id) : handleLike(post.id)}
                    >
                      <img
                        src={post.liked ? likedIcon : likeIcon}
                        alt="Like"
                        className={`custom-icon ${post.liked ? "liked" : ""}`}
                      />
                    </Button>
                    <span className="ml-2 fw-semibold">{post.likes} {post.likes === 1 ? 'like' : 'likes'}</span>
                    <Button
                      variant="link"
                      className="text-dark p-0 mr-3"
                      onClick={() => setActivePostId(activePostId === post.id ? null : post.id)}
                    >
                      <img
                        src={commentIcon}
                        alt="Comment"
                        className="custom-icon"
                        style={{ marginLeft: "7px" }}
                      />
                    </Button>
                    <Button variant="link" className="text-dark p-0">
                      <img
                        src={shareIcon}
                        alt="Share"
                        className="custom-icon"
                        style={{ marginLeft: "7px" }}
                      />
                    </Button>
                  </div>
                </div>

                <div className="comments-section mt-3">
                  {post.comments.length > 0 ? (
                    <>
                      <div key={post.comments[post.comments.length - 1].id} className="comment mb-2">
                        <span className="fw-semibold">{post.comments[post.comments.length - 1].User.username}</span>: {post.comments[post.comments.length - 1].commentText}
                      </div>
                      {post.comments.length > 1 && (
                        <Button variant="link" className="p-0 text-muted" onClick={() => handleShowModal(post)}>
                          Show more comments
                        </Button>
                      )}
                    </>
                  ) : (
                    <p>No comments yet.</p>
                  )}
                </div>

                {activePostId === post.id && (
                  <Form className="mt-3">
                    <Form.Group>
                      <Form.Control
                        type="text"
                        value={newComment}
                        onChange={handleCommentChange}
                        placeholder="Write a comment..."
                      />
                    </Form.Group>
                    <Button variant="primary" onClick={() => handleCommentSubmit(post.id)}>
                      Post
                    </Button>
                  </Form>
                )}
              </div>
            ))
          ) : (
            <p>No posts available</p>
          )}
        </Col>
      </Row>
      {selectedPost && (
        <PostModal
          show={showModal}
          handleClose={handleCloseModal}
          post={selectedPost}
        />
      )}
    </Container>
  );
};

export default MainPage;
