import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../style/LoginPage.css"; // Adjust this path as necessary
import "../style/allstyle.css";
import { Link, useNavigate } from "react-router-dom";

const SignupPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5000/user/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error: ${response.status}`);
      }

      const result = await response.json();
      console.log("User signed up successfully:", result);
      setLoading(false);
      navigate("/login");
      window.location.reload();
    } catch (error) {
      console.error("Error signing up:", error);
      setError(error.message || "An error occurred during signup");
      setLoading(false);
    }
  };

  return (
    <>
      <div className="container d-flex justify-content-center align-items-center min-vh-100 bg-white">
        <div className="bg-white p-4 w-100" style={{ maxWidth: "350px" }}>
          <div
            className="mydes"
            style={{ border: "2px solid rgba(0, 0, 0, .05)", padding: "20px" }}
          >
            <h1 className="text-center mb-2" style={{ marginLeft: "70px" }}>
              <span className="d-block instagram-logo"></span>
            </h1>
            <div className="fs-16 text-center mb-4" style={{ color: "#737373" }}>
              Sign up to see photos and videos <br /> from your friends.
            </div>

            <div className="d-grid gap-2 col-12 0-5 mb-3">
              <a href="#" className="text-decoration-none text-center">
                <button className="btn btn-primary" type="button">
                  Log in with Facebook
                </button>
              </a>
            </div>

            <div className="d-flex justify-content-between align-items-center mb-1">
              <div className="flex-grow border-top border-secondary"></div>
              <span className="mx-2 text-muted">OR</span>
              <div className="flex-grow border-top border-secondary"></div>
            </div>

            {error && (
              <div className="alert alert-danger text-center" role="alert">
                {error}
              </div>
            )}

            <form className="d-flex flex-column" onSubmit={handleSubmit}>
              <input
                className="form-control mb-2 my-input"
                name="email"
                placeholder="Mobile Number or Email"
                type="text"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <input
                className="form-control mb-2 my-input"
                name="fullName"
                placeholder="Full Name"
                type="text"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
              <input
                className="form-control mb-2 my-input"
                name="username"
                placeholder="Username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                required
              />
              <input
                className="form-control mb-4 my-input"
                name="password"
                placeholder="Password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
              />

              <button
                type="submit"
                className="btn btn-primary mb-2"
                disabled={loading}
              >
                {loading ? "Signing Up..." : "Sign Up"}
              </button>
            </form>

            <div className="text-center">
              <span className="d-block text-black fs-14">
                Have an account?{" "}
                <Link className="text-primary font-weight-bold" to="/login">
                  <span className="fw-bold fs-14" style={{ color: "#0095F6" }}>
                    Log in
                  </span>
                </Link>
              </span>
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

      <div className="row border-top py-2">
        <div
          className="col-lg-12 text-center fs-12"
          style={{ color: "#C7C7C7" }}
        >
          <p className="mb-0">
            About · Help · Press · API · Jobs · Privacy · Terms · Locations ·
            Language
          </p>
          <p className="mb-0">© 2024 INSTAGRAM FROM META</p>
        </div>
      </div>
    </>
  );
};

export default SignupPage;
