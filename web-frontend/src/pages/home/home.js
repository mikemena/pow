import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import NavBar from '../../components/Nav/Nav';
import './home.css';

const HomePage = () => {
  const [activeDiv, setActiveDiv] = useState(null);
  const navigate = useNavigate();

  const { ref, inView } = useInView({
    threshold: 0.1
  });

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
      <NavBar />
      <div className='full-viewport-div'>
        <h1 className='main-title'>Pr00f 0f W0rk</h1>
        <div
          className={inView ? 'arrow-hidden' : 'arrow'}
          onClick={scrollToNextPage}
        >
          ↓
        </div>
      </div>
      <div className='container' ref={ref}>
        <div
          ref={ref}
          className={`child left ${inView ? 'inview-active' : ''}`}
          onClick={navigateToCreateProgramPage}
          onMouseEnter={() => handleMouseEnter('div1')}
          onMouseLeave={handleMouseLeave}
        >
          <h2>Programs</h2>
          <h1>Start Program</h1>
        </div>
        <div
          ref={ref}
          className={`child center ${inView ? 'inview-active' : ''}`}
          onClick={navigateToProgramPage}
          onMouseEnter={() => handleMouseEnter('div2')}
          onMouseLeave={handleMouseLeave}
        >
          <h2>Workout</h2>
          <h1>Workout Using Program</h1>
        </div>
        <div
          ref={ref}
          className={`child right ${inView ? 'inview-active' : ''}`}
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
