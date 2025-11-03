import React from 'react';
import './DarkModeButon.css';

const DarkModeButon = ({ isDarkMode, onToggle }) => {
  const handleChange = (e) => {
    onToggle();
  };

  return (
    <>
      <input 
        type="checkbox" 
        id="dark-mode-checkbox"
        checked={isDarkMode}
        onChange={handleChange}
      />
      <div className="container">
        <div className="theme-switch-wrapper">
          <label className="theme-switch" htmlFor="dark-mode-checkbox">
            <div className="slider round">
              <div className="sun-ray-1"></div>
              <div className="sun-ray-2"></div>
            </div>
          </label>
        </div>
      </div>
    </>
  );
};

export default DarkModeButon;