import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';
import './Auth.css';

const AuthModal = ({ isOpen, onClose, onLogin, onRegister }) => {
  const [isLoginMode, setIsLoginMode] = useState(true);

  if (!isOpen) return null;

  const handleLogin = (user) => {
    onLogin(user);
  };

  const handleRegister = (user) => {
    onRegister(user);
  };

  const handleClose = () => {
    setIsLoginMode(true); // Reset to login mode when closing
    onClose();
  };

  return (
    <div className="auth-modal-overlay" onClick={handleClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        {isLoginMode ? (
          <Login
            onLogin={handleLogin}
            onSwitchToRegister={() => setIsLoginMode(false)}
            onClose={handleClose}
          />
        ) : (
          <Register
            onRegister={handleRegister}
            onSwitchToLogin={() => setIsLoginMode(true)}
            onClose={handleClose}
          />
        )}
      </div>
    </div>
  );
};

export default AuthModal;
