import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/Inputs/Button';
import NavBar from '../../../components/Nav/Nav';
import { useTheme } from '../../../contexts/themeContext';

import './programs.css';

const ProgramPage = () => {
  const [programs, setPrograms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { theme } = useTheme();

  useEffect(() => {
    fetch('http://localhost:9025/api/programs/2')
      .then(response => response.json())
      .then(data => {
        setPrograms(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Failed to fetch programs:', error);
        setIsLoading(false); // Finish loading even if there was an error
      });
  }, []);

  const handleCreateProgram = () => {
    navigate('/create-program');
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  console.log('programs from programs page:', programs);

  return (
    <div>
      <NavBar />
      <div className='view-prog-page'>
        <h1>My Programs</h1>
        <Button onClick={handleCreateProgram}>Create</Button>
      </div>
      <div className='view-prog-page__program-list'>
        {programs.map(program => (
          <div key={program.id} className={`view-prog-page__program ${theme}`}>
            <h2 className='view-prog-page__program-title'>{program.name}</h2>
            <div className='view-prog-page__program-details'>
              <p className='view-prog-page__program-details-label'>Main Goal</p>
              <p className='view-prog-page__program-details-value'>
                {program.main_goal}
              </p>
              <p className='view-prog-page__program-details-label'>Duration</p>
              <p className='view-prog-page__program-details-value'>
                {program.program_duration} {program.duration_unit}
              </p>
              <p className='view-prog-page__program-details-label'>
                Days Per Week
              </p>
              <p className='view-prog-page__program-details-value'>
                {program.days_per_week}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgramPage;
