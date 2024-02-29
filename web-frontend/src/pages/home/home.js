import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './home.css';

const HomePage = () => {
  const [activeDiv, setActiveDiv] = useState(null);

  const navigate = useNavigate();

  const navigateToProgramPage = () => {
    navigate('/programs');
  };

  const navigateToCreateProgramPage = () => {
    navigate('/create-program');
  };

  const scrollToNextPage = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  };

  const handleClick = divId => {
    setActiveDiv(activeDiv === divId ? null : divId);
  };

  const handleMouseEnter = divId => {
    setActiveDiv(divId);
  };

  const handleMouseLeave = () => {
    setActiveDiv(null); // Optional: Remove active state on mouse leave
  };

  return (
    <div>
      <div className='full-viewport-div'>
        <h1 className='main-title'>Pr00f 0f W0rk</h1>
        <div className='arrow scroll-down' onClick={scrollToNextPage}>
          &#x2193; {/* Downwards arrow symbol, or use an icon */}
        </div>
      </div>
      <div className='container'>
        <div
          className={`child left ${activeDiv === 'div1' ? 'active' : ''}`}
          onClick={navigateToCreateProgramPage}
          onMouseEnter={() => handleMouseEnter('div1')}
          onMouseLeave={handleMouseLeave}
        >
          <h2>Programs</h2>
          <h1>Start Program</h1>
        </div>
        <div
          className={`child center ${activeDiv === 'div2' ? 'active' : ''}`}
          onClick={navigateToProgramPage}
          onMouseEnter={() => handleMouseEnter('div2')}
          onMouseLeave={handleMouseLeave}
        >
          <h2>Workout</h2>
          <h1>Workout Using Program</h1>
        </div>
        <div
          className={`child right ${activeDiv === 'div3' ? 'active' : ''}`}
          onClick={() => handleClick('div3')}
          onMouseEnter={() => handleMouseEnter('div3')}
          onMouseLeave={handleMouseLeave}
        >
          <h2>Workout</h2>
          <h1>Quick Workout</h1>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
