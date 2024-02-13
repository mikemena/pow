import React from 'react';
import './Button.css';

const Button = ({ children, onClick, type = 'button', ...props }) => {
  // Generate a unique ID for the dropdown to link the label and div
  const buttonId = `btn-${children.replace(/\s+/g, '-').toLowerCase()}`;

  return (
    <button
      id={buttonId}
      className='material-button'
      onClick={onClick}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
