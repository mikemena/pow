import React from 'react';

const Collapse = ({ title, children, isActive, onToggle }) => {
  return (
    <div>
      <button onClick={onToggle}>{title}</button>
      <div style={{ display: isActive ? 'block' : 'none' }}>{children}</div>
    </div>
  );
};
export default Collapse;
