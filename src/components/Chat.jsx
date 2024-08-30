import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { ListGroup } from 'react-bootstrap';

const socket = io(process.env.REACT_APP_API_URL || 'http://localhost:5000', {
  transports: ['websocket'],
});

const CombinedChatPage = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [roomId, setRoomId] = useState(null);

  useEffect(() => {
    // Fetch users for the user list
    const fetchUsers = async () => {
      try {
        const response = await fetch(`localhost:5000/user/`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
        });
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (!selectedUser) return;

    const fetchSelectedUserDetails = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/posts/user/${selectedUser.id}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        const data = await response.json();
        setSelectedUser(data);
        const userToken = localStorage.getItem('token');
        const parsedUserId = parseJwt(userToken).id;
        const generatedRoomId = generateRoomId(parsedUserId, selectedUser.id);
        setRoomId(generatedRoomId);
        socket.emit('joinRoom', { roomId: generatedRoomId, userId: parsedUserId });
      } catch (error) {
        console.error('Error fetching selected user details:', error);
      }
    };

    fetchSelectedUserDetails();

    const handleMessage = (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    socket.on('message', handleMessage);

    return () => {
      socket.off('message', handleMessage);
    };
  }, [selectedUser]);

  const sendMessage = () => {
    if (message.trim() === '' || !roomId) return;

    socket.emit('chatMessage', { roomId, message });
    setMessage('');
  };

  const handleUserSelect = (userId) => {
    setSelectedUser({ id: userId });
  };

  return (
    <div className="container-fluid g-0 bg-black">
      <div className="row" style={{ height: '100vh' }}>
        {/* User List Section */}
        <div className="col-md-4" style={{ borderRight: '2px solid grey', borderLeft: '2px solid grey', overflowY: 'scroll' }}>
          <h2>Users</h2>
          <ListGroup>
            {users.map(user => (
              <ListGroup.Item
                key={user.id}
                className="d-flex justify-content-between align-items-center cursor-pointer"
                onClick={() => handleUserSelect(user.id)}
              >
                <img
                  src={`${process.env.REACT_APP_API_URL}/public/${user.profilePic}`}
                  alt={`${user.name}'s profile`}
                  className="rounded-circle me-2"
                  style={{ width: '40px', height: '40px' }}
                />
                {user.name}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </div>

        {/* Chat Section */}
        <div className="col-md-8" style={{ borderRight: '2px solid grey', borderLeft: '2px solid grey' }}>
          {selectedUser ? (
            <>
              <div className="d-flex align-items-center p-3 border-bottom">
                <img
                  src={`${process.env.REACT_APP_API_URL}/public/${selectedUser.profilePic}`}
                  alt={`${selectedUser.name}'s profile`}
                  className="rounded-circle me-2"
                  style={{ width: '40px', height: '40px' }}
                />
                <h5 className="m-0">{selectedUser.name}</h5>
              </div>
              <div className="border rounded p-3 mb-3" style={{ height: '400px', overflowY: 'scroll' }}>
                {messages.map((msg, index) => (
                  <div key={index} className="mb-2">
                    <div className="bg-light p-2 rounded">{msg}</div>
                  </div>
                ))}
              </div>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <button className="btn btn-primary" onClick={sendMessage}>
                  Send
                </button>
              </div>
            </>
          ) : (
            <p>Select a user to start chatting.</p>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper function to decode JWT token
function parseJwt(token) {
  if (!token) return {};
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(atob(base64).split('').map(c =>
    '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
  ).join(''));
  return JSON.parse(jsonPayload);
}

function generateRoomId(userId1, userId2) {
  const sortedIds = [userId1, userId2].sort();
  return `${sortedIds[0]}_${sortedIds[1]}`;
}

export default CombinedChatPage;
