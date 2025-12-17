import React from 'react';

const Header = ({ user, onLogout }) => {
  return (
    <header className="header">
      <h1>Chat by ARTur</h1>
      {user && (
        <div className="header-user">
          <span>Logged in as: {user.username}</span>
          <button className="logout-btn" onClick={onLogout}>
            Logout
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;