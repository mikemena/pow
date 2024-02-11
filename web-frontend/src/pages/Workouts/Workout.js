import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // if you're using react-router-dom

const AddTemplatePage = () => {
  const [templateName, setTemplateName] = useState('');
  const navigate = useNavigate(); // if you're using react-router-dom

  const handleAddExercises = () => {
    // Redirect to exercises page and pass state
    navigate.push('/exercises', { isSelectingForTemplate: true, templateName });
  };

  return (
    <div className='workout-page'>
      <h1 className='page_title'>Start Workout</h1>
      <h2 className='page_subtitle'>Quick Start</h2>
      <button>Start an Empty Workout</button>
      <div className='template-header'>
        <h2 className='page_subtitle'>Templates</h2>
        <button>Create New Template</button>
      </div>
      <input
        type='text'
        value={templateName}
        onChange={e => setTemplateName(e.target.value)}
        placeholder='Enter template name'
      />
      <button onClick={handleAddExercises}>Add Exercises</button>
    </div>
  );
};

export default AddTemplatePage;
