// src/Pages/LoginLayout.jsx

import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/LoginPage.css'; // Ensure this path matches your project structure
import "../style/allstyle.css";
import { Link, useNavigate } from 'react-router-dom';

const LoginLayout = () => {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        fetch("http://localhost:5000/user/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        })
            .then((response) => {
                if (!response.ok) {
                    return response.json().then((errorData) => {
                        throw new Error(errorData.message || `Error: ${response.status}`);
                    });
                } else {
                    return response.json();
                }
            })
            .then((result) => {
                console.log("User logged in successfully:", result);
                const { token, userId } = result;

                // Store token and userId in local storage
                localStorage.setItem('token', token);
                localStorage.setItem('userId', userId);

                setLoading(false);
                // Force a page reload to update the authentication state
                window.location.reload(); // Refresh the page
            })
            .catch((error) => {
                console.error("Error logging in:", error);
                setError(error.message || "An error occurred");
                setLoading(false);
            });
    };

    return (
        <>
            <div className="container d-flex justify-content-center align-items-center min-vh-100 bg-white">
                <div className="bg-white p-4 w-100" style={{ maxWidth: '350px' }}>
                    <div className="mydes" style={{ border: '2px solid rgba(0, 0, 0, .05)', padding: '20px' }}>
                        <h1 className="text-center mb-4" style={{ marginLeft: "70px" }}>
                            <span className="d-block instagram-logo"></span>
                        </h1>
                        <form className="d-flex flex-column" onSubmit={handleSubmit}>
                            <input
                                autoFocus
                                className="form-control mb-2 my-input"
                                name="username"
                                placeholder="Username"
                                type="text"
                                value={formData.username}
                                onChange={handleChange}
                            />
                            <input
                                autoFocus
                                className="form-control mb-4 my-input"
                                name="password"
                                placeholder="Password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                            />
                            <button
                                type="submit"
                                className="btn btn-primary mb-2"
                                disabled={loading}
                            >
                                {loading ? "Logging In..." : "Log In"}
                            </button>
                            {error && <div className="alert alert-danger">{error}</div>}
                        </form>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <div className="flex-grow border-top border-secondary"></div>
                            <span className="mx-2 text-muted">or</span>
                            <div className="flex-grow border-top border-secondary"></div>
                        </div>
                        <a href="" className='d-flex align-items-center w-100 mb-3' style={{ marginLeft: "77px", textDecoration: "none" }}>
                            <div className="facebook-logo mr-2" style={{ marginRight: "10px" }}></div>
                            <span className='fw-bold fs-14' style={{ color: '#385185' }}>Log in with Facebook</span>
                        </a>
                        <a
                            className="d-block text-center text-primary mb-4"
                            href="#forgot-password"
                            style={{ textDecoration: "none" }}
                        >
                        </a>
                        <div className="text-center">
                            <span className="d-block text-black fs-14">Don't have an account? <Link className="text-primary font-weight-bold" to="/signup">
                                <span className='fw-bold fs-14' style={{ color: '#0095F6' }}>Sign up</span>
                            </Link></span>
                        </div>
                    </div>
                    <div className="text-center mt-4" style={{ marginLeft: "30px" }}>
                        <span className="d-block text-black">Get the app.</span>
                        <div className="d-flex justify-content-center mt-2">
                            <div className="apple-store-logo mr-2"></div>
                            <div className="google-store-logo"></div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LoginLayout;
