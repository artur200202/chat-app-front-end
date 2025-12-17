import React, { useState } from 'react';
import Header from './components/Header';
import UserLogin from './components/UserLogin';
import RoomList from './components/RoomList';
import ChatRoom from './components/ChatRoom';
import './App.css';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentRoom, setCurrentRoom] = useState(null);

  const handleLogin = (user) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      setCurrentUser(null);
      setCurrentRoom(null);
    }
  };

  const handleRoomSelect = (room) => {
    setCurrentRoom(room);
  };

  const handleRoomDeleted = () => {
    setCurrentRoom(null);
  };

  return (
    <div className="app">
      <Header user={currentUser} onLogout={handleLogout} />
      {!currentUser ? (
        <UserLogin onLogin={handleLogin} />
      ) : (
        <div className="chat-container">
          <RoomList 
            currentRoom={currentRoom} 
            onRoomSelect={handleRoomSelect}
            onRoomDeleted={handleRoomDeleted}
          />
          <ChatRoom room={currentRoom} user={currentUser} />
        </div>
      )}
    </div>
  );
}

export default App;