import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import defaultPfp from "../image/default-profile.jpg"; // Default profile picture

export default function Exploresearch() {
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState({ users: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const userId = localStorage.getItem('userId');

      if (!userId) {
        setError('User ID not found in local storage');
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/users/${userId}`, {
          headers: { 'Cache-Control': 'no-cache' }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const userData = await response.json();
        setUser(userData);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchUserData();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:5000/search?query=${encodeURIComponent(searchQuery)}`, {
        headers: { 'Cache-Control': 'no-cache' }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch results');
      }

      const data = await response.json();
      setSearchResults({ users: data.users });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Explore</h1>

      <form onSubmit={handleSearch} className="d-flex mb-4">
        <input
          type="text"
          placeholder="Search for users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="form-control me-2"
        />
        <button type="submit" className="btn btn-primary">
          Search
        </button>
      </form>

      {loading && <div className="alert alert-info">Loading...</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="search-results">
        <h2>Users</h2>
        {searchResults.users.length > 0 ? (
          <div className="row">
            {searchResults.users.map((user) => {
              console.log('Profile Picture:', user.profilePicture); // Debugging line
              const profilePictureUrl = user.profilePicture
                ? `http://localhost:5000/uploads/${user.profilePicture}`
                : defaultPfp;

              return (
                <div className="col-md-4 mb-4" key={user.id}>
                  <Link to={`/profile/${user.id}`} className="text-decoration-none">
                    <div className="card text-center">
                      <div className="card-body">
                        <img
                          src={profilePictureUrl}
                          alt={`${user.username}'s profile`}
                          className="rounded-circle mb-3"
                          style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                        />
                        <h5 className="card-title">{user.username}</h5>
                        <p className="card-text">{user.fullName}</p>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        ) : (
          <p>No users found</p>
        )}
      </div>
    </div>
  );
}
