import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProgramForm from '../../../components/Program/ProgramForm';
import Button from '../../../components/Inputs/Button';
import NavBar from '../../../components/Nav/Nav';

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

  // const handleDelete = async program_id => {
  //   try {
  //     const response = await fetch(
  //       `http://localhost:9025/api/programs/${program_id}`,
  //       {
  //         method: 'DELETE'
  //       }
  //     );
  //     if (response.status === 204) {
  //       setPrograms(currentPrograms =>
  //         currentPrograms.filter(program => program.program_id !== program_id)
  //       );
  //     }
  //   } catch (error) {
  //     console.error('Failed to delete program:', error);
  //   }
  // };

  // const handleEdit = program => {
  //   navigate(`/edit-program/${program.program_id}`, { state: { program } });
  // };

  // console.log('programs from programs page:', programs);

  return (
    <div className='view-prog-container'>
      <NavBar />
      <div className='view-prog-container__header'>
        <h1 className='view-prog-container__title'>My Programs</h1>
        <div>
          <Button id='create-program-btn' onClick={handleCreateProgram}>
            Create
          </Button>
        </div>
      </div>
      <div className='view-prog-container_items'>
        {programs.map(program => (
          <ProgramForm
            program={program}
            key={program.program_id}
            isEditing={false}
            // onDelete={handleDelete}
            // onEdit={handleEdit}
          />
        ))}
      </div>
    </div>
  );
};

export default ProgramPage;
