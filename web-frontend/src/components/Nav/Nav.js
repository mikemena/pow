import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logoSvg from '../../assets/concentric_circles.svg';
import './Nav.css';

const Navbar = ({ theme, toggleTheme }) => {
  const [isActive, setIsActive] = useState(false);

  const toggleSwitch = () => {
    setIsActive(current => !current);
  };
  return (
    <nav className={`navbar ${theme}`}>
      <img src={logoSvg} alt='POW' className='navbar-logo' />
      <ul className='nav-links'>
        <li>
          <Link to='/workouts' className='nav-item'>
            Workouts
          </Link>
        </li>
        <li>
          <Link to='/exercises' className='nav-item'>
            Exercises
          </Link>
        </li>
        <li>
          <Link to='/progress' className='nav-item'>
            Progress
          </Link>
        </li>
        <li>
          <Link to='/profile' className='nav-item'>
            Profile
          </Link>
        </li>
      </ul>
      <div
        className={`toggle-switch ${isActive ? 'active' : ''}`}
        onClick={toggleSwitch}
      >
        <div className='toggle-switch-ball'></div>
      </div>
    </nav>
  );
};

export default Navbar;
