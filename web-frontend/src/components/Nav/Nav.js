import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Toggle from '../Inputs/Toggle';
import { FiMenu, FiX } from 'react-icons/fi';
import { useTheme } from '../../contexts/themeContext';
import './Nav.css';

const Navbar = () => {
  const [menuClicked, setMenuClicked] = useState(false);
  const { theme } = useTheme();

  const toggleMenuClick = () => {
    setMenuClicked(!menuClicked);
  };

  return (
    <div>
      <nav className={`navbar ${theme}-theme`}>
        <Link to='/' className='navbar_logo'>
          <h1 className='navbar__site-name'>WRKT</h1>
        </Link>
        {menuClicked ? (
          <FiX size={25} className={'navbar_menu'} onClick={toggleMenuClick} />
        ) : (
          <FiMenu
            size={25}
            className={'navbar_menu'}
            onClick={toggleMenuClick}
          />
        )}
        <ul
          className={
            menuClicked ? 'navbar_list navbar_list--active' : 'navbar_list'
          }
        >
          <li className='navbar_item'>
            <Link to='/programs' className='navbar_link'>
              Programs
            </Link>
          </li>
          <li className='navbar_item'>
            <Link to='/workouts' className='navbar_link'>
              Workouts
            </Link>
          </li>
          <li className='navbar_item'>
            <Link to='/exercises' className='navbar_link'>
              Exercises
            </Link>
          </li>
          <li className='navbar_item'>
            <Link to='/progress' className='navbar_link'>
              Progress
            </Link>
          </li>
          <li className='navbar_item'>
            <Link to='/profile' className='navbar_link'>
              Profile
            </Link>
          </li>
          <li>
            <Toggle />
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
