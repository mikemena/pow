import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Program from '../../../components/Program/Program';
import Nav from '../../../components/Nav/Nav';
import './template.css';

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

  const handleEmptyProgram = () => {
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
    <div className='page-layout'>
      <Nav />
      <h1 className='page-title'>Start Workout</h1>
      <h2 className='page-subtitle'>Quick Start</h2>
      <div id='start-empty-container'>
        <button onClick={handleEmptyProgram}>Start an Empty Workout</button>
      </div>
      <div id='template-header-container'>
        <h2 className='section-title'>Templates</h2>
        <button onClick={handleCreateProgram}>Create New Program</button>
      </div>
      <div id='workout-template-container'>
        {programs.map(program => (
          <Program
            workout_id={template.workout_id}
            key={template.workout_id}
            name={template.workout_name}
            plan_type={template.plan_type}
            day_type={template.workout_day_type}
            difficulty_level={template.difficulty_level}
            exercises={template.exercises}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        ))}
      </div>
    </div>
  );
};

export default ProgramPage;
