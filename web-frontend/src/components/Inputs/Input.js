import React from 'react';
import './Input.css';

const Input = ({ label, value, onChange, placeholder }) => {
  return (
    <div className='material-input'>
      <input placeholder={placeholder} value={value} onChange={onChange} />
      <label>{label}</label>
    </div>
  );
};

export default Input;
