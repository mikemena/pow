import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ProgramContext } from '../../contexts/programContext';
import { FiMenu, FiX } from 'react-icons/fi';
import { useTheme } from '../../contexts/themeContext';
import './Nav.css';

const Navbar = () => {
  const { clearProgram } = useContext(ProgramContext);
  const navigate = useNavigate();
  const [menuClicked, setMenuClicked] = useState(false);
  const { theme } = useTheme();

  const toggleMenuClick = () => {
    setMenuClicked(!menuClicked);
  };

  const handleNavClick = path => {
    clearProgram();
    navigate(path);
  };

  return (
    <div className='navbar-container'>
      <nav className={`navbar ${theme}-theme`}>
        <Link
          to='/'
          onClick={() => handleNavClick('/')}
          className='navbar__logo'
        >
          <h1 className={`navbar__site-name ${theme}`}>WRKT</h1>
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
          className={`navbar_list ${
            menuClicked ? 'navbar_list--active' : ''
          } ${theme}`}
        >
          <li className='navbar_item'>
            <Link
              to='/programs'
              onClick={() => handleNavClick('/programs')}
              className={`navbar_link ${theme}`}
            >
              Programs
            </Link>
          </li>
          <li className='navbar_item'>
            <Link
              to='/workouts'
              onClick={() => handleNavClick('/workouts')}
              className={`navbar_link ${theme}`}
            >
              Workouts
            </Link>
          </li>
          <li className='navbar_item'>
            <Link
              to='/exercises'
              onClick={() => handleNavClick('/exercises')}
              className={`navbar_link ${theme}`}
            >
              Exercises
            </Link>
          </li>
          <li className='navbar_item'>
            <Link
              to='/progress'
              onClick={() => handleNavClick('/progress')}
              className={`navbar_link ${theme}`}
            >
              Progress
            </Link>
          </li>
          <li className='navbar_item'>
            <Link to='/profile' className={`navbar_link ${theme}`}>
              Profile
            </Link>
          </li>
          <li></li>
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
