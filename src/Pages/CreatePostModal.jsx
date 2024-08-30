import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import imageCompression from 'browser-image-compression';

const CreatePostModal = ({ show, handleClose }) => {
  const [userId, setUserId] = useState("");
  const [caption, setCaption] = useState("");
  const [imageBase64, setImageBase64] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  const handleFileCompression = async (file) => {
    try {
      const options = {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 1024,
        useWebWorker: true,
      };

      const compressedFile = await imageCompression(file, options);
      return compressedFile;
    } catch (error) {
      console.error('Error compressing file:', error);
      return file;
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const compressedFile = await handleFileCompression(file);
        const reader = new FileReader();
        reader.readAsDataURL(compressedFile);
        reader.onloadend = () => {
          setImageBase64(reader.result);
        };
      } catch (error) {
        console.error('Error uploading image:', error);
        setError('Failed to process image');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageBase64 || !userId) {
      setError('Image and user ID are required');
      return;
    }

    const postData = {
      userId,
      caption,
      imageBase64,
    };

    try {
      const response = await fetch("http://localhost:5000/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log("Post created successfully:", data);
      handleClose();
    } catch (error) {
      console.error("Error creating post:", error);
      setError('Failed to create post');
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Create New Post</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formCaption">
            <Form.Label>Caption</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Enter caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formImage">
            <Form.Label>Image</Form.Label>
            <Form.Control
              type="file"
              onChange={handleImageUpload}
              accept="image/*"
              required
            />
          </Form.Group>
          {imageBase64 && (
            <img
              src={imageBase64}
              alt="Preview"
              className="img-fluid mt-2"
            />
          )}
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CreatePostModal;
