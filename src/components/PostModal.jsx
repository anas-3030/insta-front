import React, { useState, useEffect } from 'react';
import { Modal, Button, Image, Form } from 'react-bootstrap';
import likeIcon from "../image/heart.png";
import likedIcon from "../image/heart (1).png";
import commentIcon from "../image/chat.png";
import shareIcon from "../image/send.png";
import saveIcon from "../image/bookmark.png";
import defaultpfp from "../image/default-profile.jpg";
import trashBinIcon from "../image/trash-bin.png"; // Add your trash bin icon here

const PostModal = ({ show, handleClose, post }) => {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [deletingCommentId, setDeletingCommentId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (post) {
      fetch(`http://localhost:5000/like/posts/${post.id}/like/status?userId=${localStorage.getItem('userId')}`)
        .then(response => response.json())
        .then(data => setLiked(data.liked))
        .catch(error => console.error('Error fetching like status:', error));

      fetch(`http://localhost:5000/like/posts/${post.id}/like/count`)
        .then(response => response.json())
        .then(data => setLikesCount(data.likeCount))
        .catch(error => console.error('Error fetching like count:', error));
      
      fetchComments();
    }
  }, [post]);

  const fetchComments = async () => {
    try {
      const response = await fetch(`http://localhost:5000/comments/posts/${post.id}/specomments`);
      const updatedComments = await response.json();
      post.comments = updatedComments;
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleLike = async () => {
    try {
      const response = await fetch(`http://localhost:5000/like/posts/${post.id}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: localStorage.getItem('userId') }),
      });

      if (!response.ok) {
        throw new Error('Failed to like post');
      }

      setLiked(true);
      setLikesCount(prevCount => prevCount + 1);
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleUnlike = async () => {
    try {
      const response = await fetch(`http://localhost:5000/like/posts/${post.id}/like`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: localStorage.getItem('userId') }),
      });

      if (!response.ok) {
        throw new Error('Failed to unlike post');
      }

      setLiked(false);
      setLikesCount(prevCount => Math.max(prevCount - 1, 0));
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleCommentChange = (event) => {
    setNewComment(event.target.value);
  };

  const handleCommentSubmit = async () => {
    try {
      const response = await fetch(`http://localhost:5000/comments/posts/${post.id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: localStorage.getItem('userId'), commentText: newComment }),
      });

      if (!response.ok) {
        throw new Error('Failed to post comment');
      }

      fetchComments();
      setNewComment("");
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleDeleteComment = async () => {
    try {
      const response = await fetch(`http://localhost:5000/comments/${deletingCommentId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete comment');
      }

      fetchComments();
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error(error.message);
    }
  };

  const openDeleteConfirm = (commentId) => {
    setDeletingCommentId(commentId);
    setShowDeleteConfirm(true);
  };

  if (!post) return null;

  return (
    <>
      <Modal show={show} onHide={handleClose} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Post by {post.User?.username || "Unknown User"}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="d-flex">
          <div style={{ flex: 2 }}>
            <Image src={post.imageUrl} fluid />
          </div>
          <div style={{ flex: 1, paddingLeft: "20px" }}>
            <div className="d-flex align-items-center mb-3">
              <Image
                src={
                  post.User?.profilePicture
                    ? post.User?.profilePicture
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
            <div>
              <Button
                variant="link"
                className="text-dark p-0 mr-3"
                onClick={() => (liked ? handleUnlike() : handleLike())}
              >
                <img
                  src={liked ? likedIcon : likeIcon}
                  alt="Like"
                  className="custom-icon"
                />
              </Button>
              <span className="ml-2 fw-semibold">{likesCount} {likesCount === 1 ? 'like' : 'likes'}</span>
              <Button variant="link" className="text-dark p-0 mr-3">
                <img src={commentIcon} alt="Comment" className="custom-icon" />
              </Button>
              <Button variant="link" className="text-dark p-0">
                <img src={shareIcon} alt="Share" className="custom-icon" />
              </Button>
              <Button variant="link" className="text-dark p-0">
                <img src={saveIcon} alt="Save" className="custom-icon" />
              </Button>
            </div>
            <div className="comments-section mt-3" style={{ maxHeight: "200px", overflowY: "auto" }}>
              {post.comments && post.comments.length > 0 ? (
                post.comments.map((comment) => (
                  <div key={comment.id} className="comment mb-2 d-flex align-items-center">
                    <Image
                      src={
                        comment.User?.profilePicture
                          ? `http://localhost:5000/uploads/${comment.User.profilePicture}`
                          : defaultpfp
                      }
                      roundedCircle
                      fluid
                      style={{
                        width: "30px",
                        height: "30px",
                        objectFit: "cover",
                        marginRight: "10px",
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <span className="fw-semibold">{comment.User?.username}</span>
                      <div>{comment.commentText}</div>
                    </div>
                    <Button
                      variant="link"
                      className="text-dark p-0"
                      onClick={() => openDeleteConfirm(comment.id)}
                    >
                      <img src={trashBinIcon} alt="Delete" style={{ width: "20px", height: "20px" }} />
                    </Button>
                  </div>
                ))
              ) : (
                <p>No comments yet.</p>
              )}
            </div>
            <Form className="mt-3">
              <Form.Group>
                <Form.Control
                  type="text"
                  value={newComment}
                  onChange={handleCommentChange}
                  placeholder="Write a comment..."
                />
              </Form.Group>
              <Button variant="primary" onClick={handleCommentSubmit}>
                Post
              </Button>
            </Form>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteConfirm} onHide={() => setShowDeleteConfirm(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this comment?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={() => handleDeleteComment(deletingCommentId)}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default PostModal;
