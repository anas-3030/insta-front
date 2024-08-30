import React, { useState, useEffect } from 'react';
import '../style/ProfileLayout.css';
import defaultpfp from "../image/default-profile.jpg";
import ProfilePostModal from './ProfileModal'; // Updated import
import 'bootstrap/dist/css/bootstrap.min.css';

const ProfileLayout = () => {
  // Get the userId from localStorage
  const [userId, setUserId] = useState(localStorage.getItem('userId'));
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) return;

      try {
        const userResponse = await fetch(`http://localhost:5000/users/${userId}`);
        const userData = await userResponse.json();
        setUser(userData);

        const postsResponse = await fetch(`http://localhost:5000/users/${userId}/posts`);
        const postsData = await postsResponse.json();
        setPosts(postsData);

        const followStatusResponse = await fetch(`http://localhost:5000/users/${userId}/is-following`);
        const followStatusData = await followStatusResponse.json();
        setIsFollowing(followStatusData.isFollowing);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [userId]);

  const openSection = (evt, tabName) => {
    const tabcontent = document.getElementsByClassName('profile__section__tab__tabcontent');
    for (let i = 0; i < tabcontent.length; i++) { // Fixed the initialization of 'i'
      tabcontent[i].style.display = 'none';
    }
  
    const tablinks = document.getElementsByClassName('tablinks');
    for (let i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(' active', '');
    }
  
    document.getElementById(tabName).style.display = 'block';
    evt.currentTarget.className += ' active';
  };
  

  const openPost = (post) => {
    setSelectedPost(post);
  };

  const closePost = () => {
    setSelectedPost(null);
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImageFile(reader.result); // Set Base64 string as the profile image
      };
      reader.readAsDataURL(file); // Convert image to Base64
    }
  };

  const handleProfilePictureUpload = async () => {
    if (!profileImageFile) return;

    try {
      const response = await fetch(`http://localhost:5000/user/profile-picture/user/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ profilePicture: profileImageFile ,userId}), // Send the Base64 string
      });

      const result = await response.json();
      if (response.ok) {
        setUser(result.user);
        setIsEditProfileOpen(false);
        setProfileImageFile(null);
      } else {
        console.error('Error updating profile picture:', result.message);
      }
    } catch (error) {
      console.error('Error uploading profile picture:', error);
    }
  };

  const handleFollow = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/users/${userId}/follow`, {
        method: isFollowing ? 'DELETE' : 'POST',
      });

      if (response.ok) {
        setIsFollowing(!isFollowing);
      } else {
        console.error('Error toggling follow status');
      }
    } catch (error) {
      console.error('Error following user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="profile">
      <div className="profile__profile">
        <div className="container d-flex align-items-center" style={{ marginTop: "-113px" }}>
          <div className="profile__profile__logo">
            <img
              src={user?.profilePicture ? user.profilePicture : defaultpfp}
              alt="Profile Image"
              className="img-thumbnail"
            />
          </div>
          <div className="profile__profile__details">
            <div className="profile__profile__details__userName">
              <h4>{user?.username || 'Loading...'}</h4>
              <button className="edit-profile-btn" onClick={() => setIsEditProfileOpen(true)}>Edit Profile</button>
              <button
                className={`follow-btn ${isFollowing ? 'btn-secondary' : 'btn-primary'} ${isLoading ? 'loading' : ''}`}
                onClick={handleFollow}
                disabled={isLoading}
              >
                {isLoading ? 'Loading...' : isFollowing ? 'Unfollow' : 'Follow'}
              </button>
            </div>
            <div className="profile__profile__details__follower my-3">
              <span><b>{user?.postCount || 0}</b> posts</span>
              <button><b>{user?.followersCount || 0}</b> followers</button>
              <button><b>{user?.followingCount || 0}</b> following</button>
            </div>
            <div className="profile__profile__details__displayName">
              <h6>{user?.fullName || 'Loading...'}</h6>
            </div>
          </div>
        </div>
      </div>
      <div className="profile__section">
        <div className="container">
          <div className="profile__section__tab">
            <button className="tablinks" onClick={(e) => openSection(e, 'Posts')} id="defaultOpen">
              Posts
            </button>
            <button className="tablinks" onClick={(e) => openSection(e, 'Videos')}>
              Videos
            </button>
            <button className="tablinks" onClick={(e) => openSection(e, 'Tagged')}>
              Tagged
            </button>
          </div>
        </div>
        <div id="Posts" className="profile__section__tab__tabcontent">
          {posts.length > 0 ? (
            <div className="profile__section__tab__tabcontent__container__image">
              {posts.map((post) => (
                <div className="post" key={post.id} onClick={() => openPost(post)}>
                  <img src={post.imageUrl} alt={`Post ${post.id}`} className="img-fluid" />
                </div>
              ))}
            </div>
          ) : (
            <p>No posts available.</p>
          )}
        </div>
        <div className="profile__section__tab__tabcontent" id="Videos">
          <h3>Videos</h3>
          <p>Coming soon...</p>
        </div>
        <div className="profile__section__tab__tabcontent" id="Tagged">
          <h3>Tagged</h3>
          <p>Coming soon...</p>
        </div>
      </div>

      {selectedPost && (
        <ProfilePostModal
          show={!!selectedPost}
          handleClose={closePost}
          post={selectedPost}
        />
      )}

      {isEditProfileOpen && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog" aria-labelledby="editProfileModalLabel" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="editProfileModalLabel">Edit Profile</h5>
                <button type="button" className="close" onClick={() => setIsEditProfileOpen(false)} aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <input type="file" className="form-control mb-3" onChange={handleProfilePictureChange} />
                <button className="btn btn-primary w-100" onClick={handleProfilePictureUpload}>Upload Profile Picture</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileLayout;
