import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProgramForm from '../../../components/Program/ProgramForm';
import Button from '../../../components/Inputs/Button';
import NavBar from '../../../components/Nav/Nav';

import './programs.css';

const ProgramPage = () => {
  const [programs, setPrograms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedProgramId, setExpandedProgramId] = useState(null);
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

  const handleCreateProgram = () => {
    navigate('/create-program');
  };

  const toggleExpand = program => {
    setExpandedProgramId(expandedProgramId === program.id ? null : program.id);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  console.log('programs from programs page:', programs);

  return (
    <div>
      <NavBar />
      <div className='programs-header'>
        <h1>My Programs</h1>
        <Button onClick={handleCreateProgram}>Create</Button>
      </div>
      <div className='program-list'>
        {programs.map(program => (
          <ProgramForm
            key={program.id}
            isEditing={false} // or true, based on your requirement
            isExpanded={expandedProgramId === program.id}
            onToggleExpand={() => toggleExpand(program)}
            program={program}
          />
        ))}
      </div>
    </div>
  );
};

export default ProgramPage;
