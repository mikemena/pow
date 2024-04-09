import React from 'react';
import { useTheme } from '../../contexts/themeContext';
import './Toggle.css';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className='theme-toggle'>
      <input
        id='theme-toggle-checkbox'
        type='checkbox'
        checked={theme === 'dark'}
        onChange={toggleTheme}
      />
      <label htmlFor='theme-toggle-checkbox' className='toggle-label'>
        <span className='toggle-ball'></span>
      </label>
    </div>
  );
};

export default ThemeToggle;
