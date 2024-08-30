import React, { useState } from 'react';
import { FaHome, FaSearch, FaCompass, FaFilm, FaEnvelope, FaHeart, FaPlusSquare, FaUserCircle, FaBars } from 'react-icons/fa';
import { BsFillChatSquareTextFill } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import { Button, Dropdown } from 'react-bootstrap';
import CreatePostModal from '../Pages/CreatePostModal';
import '../style/Sidebar.css';
import '../style/allstyle.css';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
// import SwitchAccount from '../components/SwitchAccount'
const Sidebar = () => {
  const [showModal, setShowModal] = useState(false);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  // Get the user ID from local storage
  const userId = localStorage.getItem('userId');

 

  return (
    <div className="sidebar">
      <div className="p-3">
        <img
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          alt="Instagram"
          className="img-fluid mb-3 d-none d-md-block"
        />
        <ul className="nav flex-column items">
          <li className="nav-item mb-2">
            <Link to="/" className="nav-link text-dark">
              <FaHome className="me-2" />
              <span className="d-none d-md-inline">Home</span>
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link to="/search" className="nav-link text-dark">
              <FaSearch className="me-2" />
              <span className="d-none d-md-inline">Search</span>
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link to="/explore" className="nav-link text-dark">
              <FaCompass className="me-2" />
              <span className="d-none d-md-inline">Explore</span>
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link to="/reels" className="nav-link text-dark">
              <FaFilm className="me-2" />
              <span className="d-none d-md-inline">Reels</span>
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link to="/messages" className="nav-link text-dark">
              <FaEnvelope className="me-2" />
              <span className="d-none d-md-inline">Messages</span>
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link to="/notifications" className="nav-link text-dark">
              <FaHeart className="me-2" />
              <span className="d-none d-md-inline">Notifications</span>
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Button variant="link" className="text-dark p-0 text-decoration-none" style={{ marginLeft: "7px" }} onClick={handleShow}>
              <FaPlusSquare className="me-2" />
              <span className="d-none d-md-inline">Create</span>
            </Button>
          </li>
          <li className="nav-item mb-2">
            <Link to={`/profile/${userId}`} className="nav-link text-dark">
              <FaUserCircle className="me-2" />
              <span className="d-none d-md-inline">Profile</span>
            </Link>
          </li>
          <li className="nav-item mb-2 thread">
            <Link to="/threads" className="nav-link text-dark">
              <BsFillChatSquareTextFill className="me-2" />
              <span className="d-none d-md-inline">Threads</span>
            </Link>
          </li>
          <li className="nav-item">
            <Dropdown>
              <Dropdown.Toggle variant="link" className="text-dark p-0 text-decoration-none" id="dropdown-basic">
                <FaBars className="me-2" />
                <span className="d-none d-md-inline">More</span>
              </Dropdown.Toggle>

              <Dropdown.Menu className="dropdown-menu-dark">
                <Dropdown.Item as={Link} to="/switch-account">Switch Account</Dropdown.Item>
                <Dropdown.Item as={Link} to="/Logout">Logout</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </li>
        </ul>
      </div>
      <CreatePostModal show={showModal} handleClose={handleClose} />
    </div>
  );
};

export default Sidebar;
