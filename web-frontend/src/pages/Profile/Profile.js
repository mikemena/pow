import React, { useState } from 'react';
import Navbar from '../../components/Nav/Nav';
import './Profile.css';

const ProfilePage = () => {
  const [showDetails, setShowDetails] = useState(false);

  const handleNextClick = () => {
    setShowDetails(true); // This will trigger the slide-in of the details panel
  };

  const handleBackClick = () => {
    setShowDetails(false);
  }; // This will trigger the slide-out of the details panel

  return (
    <div className='profile-page'>
      <Navbar />
      <div className='profile'>Profile Page Under Construction</div>

      <div className='slide-container'>
        <div className={`exercise-container ${showDetails ? 'slide-out' : ''}`}>
          Exercises list goes here...
          {!showDetails && (
            <div className='next-arrow-container' onClick={handleNextClick}>
              <div className='next-arrow'>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
        </div>

        <div className={`template-details ${showDetails ? 'slide-in' : ''}`}>
          Details go here...
          {showDetails && (
            <div className='back-arrow-container' onClick={handleBackClick}>
              <div className='back-arrow'>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
