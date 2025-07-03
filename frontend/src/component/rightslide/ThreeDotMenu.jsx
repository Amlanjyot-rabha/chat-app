import React, { useState, useRef, useEffect } from 'react';
import './ThreeDotMenu.css';
import assets from '../../assets/assets';

const ThreeDotMenu = ({ isOpen, setIsOpen, onLogout, onEditProfile }) => {
  
  const menuRef = useRef(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="menu-container" ref={menuRef}>
      <button className="menu-trigger" onClick={toggleMenu}>
        <img src={assets.menu_icon} alt="Options" />
      </button>

      {isOpen && (
        <div className="menu">
          <button className="menu-item" onClick={onEditProfile}>
            Edit Profile
          </button>
          <button className="menu-item" onClick={onLogout}>
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default ThreeDotMenu;
