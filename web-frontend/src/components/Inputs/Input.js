import React from 'react';
import './Input.css';

const Input = ({ label, value, onChange }) => {
  return (
    <div className='material-input'>
      <input placeholder=' ' value={value} onChange={onChange} />
      <label>{label}</label>
    </div>
  );
};

export default Input;
