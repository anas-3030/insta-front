import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import imageCompression from 'browser-image-compression';

const StoryModal = ({ show, handleClose, handleSubmit, userId }) => {
  const [imageBase64, setImageBase64] = useState(null);
  const [error, setError] = useState('');

  // Function to convert file to base64
  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  // Function to handle file compression
  const handleFileCompression = async (file) => {
    try {
      const options = {
        maxSizeMB: 0.5,          // Maximum size in MB
        maxWidthOrHeight: 1024, // Maximum width or height in pixels
        useWebWorker: true,     // Use web worker for compression
      };

      const compressedFile = await imageCompression(file, options);
      return compressedFile;
    } catch (error) {
      console.error('Error compressing file:', error);
      return file; // Fallback to original file if compression fails
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const compressedFile = await handleFileCompression(file);
        const base64Image = await getBase64(compressedFile);
        setImageBase64(base64Image);
      } catch (error) {
        console.error('Error uploading image:', error);
        setError('Failed to process image');
      }
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!imageBase64 || !userId) return;

    const formData = {
      userId,
      imageBase64,
    };

    try {
      await handleSubmit(formData);
      handleClose(); // Close modal after successful upload
    } catch (error) {
      console.error('Error uploading image:', error);
      setError('Failed to upload image');
    }
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      contentClassName="bg-black text-white"
      dialogClassName="modal-top"
    >
      <Modal.Header closeButton className="border-bottom border-secondary">
        <Modal.Title>Upload Your Story</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleFormSubmit}>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="form-control"
          />
          {imageBase64 && (
            <img
              src={imageBase64}
              alt="Preview"
              className="img-fluid mt-2"
            />
          )}
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-between border-top border-secondary">
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button type="submit" variant="primary" onClick={handleFormSubmit}>
          Upload
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default StoryModal;
