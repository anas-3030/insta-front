// // src/components/SwitchAccountModal.jsx
// import React, { useState } from 'react';
// import { Modal, Button, Form } from 'react-bootstrap';
// import { useNavigate } from 'react-router-dom';

// const SwitchAccountModal = ({ show, handleClose }) => {
//     const [formData, setFormData] = useState({
//         username: "",
//         password: "",
//     });
//     const [error, setError] = useState("");
//     const [loading, setLoading] = useState(false);
//     const navigate = useNavigate();

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData({
//             ...formData,
//             [name]: value,
//         });
//     };

//     const handleSwitchAccount = (e) => {
//         e.preventDefault();
//         setLoading(true);

//         // Remove the existing token from localStorage
//         localStorage.removeItem('token');

//         // Perform the login process
//         fetch("http://localhost:5000/user/login", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify(formData),
//         })
//             .then((response) => {
//                 if (!response.ok) {
//                     return response.json().then((errorData) => {
//                         throw new Error(errorData.message || `Error: ${response.status}`);
//                     });
//                 } else {
//                     return response.json();
//                 }
//             })
//             .then((result) => {
//                 console.log("User logged in successfully:", result);
//                 const { token, userId } = result;

//                 // Store the new token and userId in localStorage
//                 localStorage.setItem('token', token);
//                 localStorage.setItem('userId', userId);

//                 setLoading(false);
//                 handleClose(); // Close the modal
//                 window.location.reload(); // Reload the page to reflect the new user session
//             })
//             .catch((error) => {
//                 console.error("Error logging in:", error);
//                 setError(error.message || "An error occurred");
//                 setLoading(false);
//             });
//     };

//     return (
//         <Modal show={show} onHide={handleClose} centered>
//             <Modal.Header closeButton>
//                 <Modal.Title>Switch Account</Modal.Title>
//             </Modal.Header>
//             <Modal.Body>
//                 <Form onSubmit={handleSwitchAccount}>
//                     <Form.Group controlId="formUsername">
//                         <Form.Label>Username</Form.Label>
//                         <Form.Control
//                             type="text"
//                             placeholder="Enter username"
//                             name="username"
//                             value={formData.username}
//                             onChange={handleChange}
//                             required
//                         />
//                     </Form.Group>
//                     <Form.Group controlId="formPassword" className="mt-3">
//                         <Form.Label>Password</Form.Label>
//                         <Form.Control
//                             type="password"
//                             placeholder="Enter password"
//                             name="password"
//                             value={formData.password}
//                             onChange={handleChange}
//                             required
//                         />
//                     </Form.Group>
//                     {error && <div className="alert alert-danger mt-3">{error}</div>}
//                     <Button variant="primary" type="submit" className="mt-4" disabled={loading}>
//                         {loading ? "Switching..." : "Switch Account"}
//                     </Button>
//                 </Form>
//             </Modal.Body>
//         </Modal>
//     );
// };

// export default SwitchAccountModal;
