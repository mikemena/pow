import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Program from '../../../components/Program/Program';

import './programs.css';

const ProgramPage = () => {
  const [programs, setPrograms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const handleCreateProgram = () => {
    // Redirect to the create program page
    navigate('/create-program');
  };

  const handleDelete = async program_id => {
    try {
      const response = await fetch(
        `http://localhost:9025/api/programs/${program_id}`,
        {
          method: 'DELETE'
        }
      );
      if (response.status === 204) {
        setPrograms(currentPrograms =>
          currentPrograms.filter(program => program.program_id !== program_id)
        );
      }
    } catch (error) {
      console.error('Failed to delete program:', error);
    }
  };

  const handleEdit = program => {
    navigate(`/edit-program/${program.program_id}`, { state: { program } });
  };

  return (
    <div className='programs'>
      <div id='program-header-container'>
        <h1 className='page-title'>My Programs</h1>
        <div id='container'>
          <div id='create-program-btn' onClick={handleCreateProgram}>
            create
          </div>
        </div>
      </div>
      <div id='programs-container'>
        {programs.map(program => (
          <Program
            program_id={program.program_id}
            key={program.program_id}
            name={program.name}
            main_goal={program.main_goal}
            day_type={program.workout_day_type}
            days_per_week={program.days_per_week}
            program_duration={program.program_duration}
            workouts={program.workouts}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        ))}
      </div>
    </div>
  );
};

export default ProgramPage;
