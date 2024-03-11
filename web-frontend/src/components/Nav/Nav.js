import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logoSvg from '../../assets/concentric_circles.svg';
import { FiMenu, FiX } from 'react-icons/fi';
import './Nav.css';

const Navbar = ({ theme, toggleTheme }) => {
  const [menuClicked, setMenuClicked] = useState(false);

  const toggleMenuClick = () => {
    setMenuClicked(!menuClicked);
  };

  return (
    <nav className='navbar'>
      <Link to='/' className='navbar_logo'>
        <img src={logoSvg} alt='POW' className='navbar_logo' />
      </Link>
      {menuClicked ? (
        <FiX size={25} className={'navbar_menu'} onClick={toggleMenuClick} />
      ) : (
        <FiMenu size={25} className={'navbar_menu'} onClick={toggleMenuClick} />
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
      </ul>
    </nav>
  );
};

export default Navbar;
