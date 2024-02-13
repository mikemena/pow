import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../../components/Inputs/Input';
import Dropdown from '../../components/Inputs/Dropdown';

const CreateTemplatePage = () => {
  const [templateName, setTemplateName] = useState('');
  const [planType, setPlanType] = useState('General');
  const [dayType, setDayType] = useState('Day of Week');
  const [difficulty, setDifficulty] = useState('Intermediate');

  const navigate = useNavigate();

  const handlePlanTypeChange = e => {
    setPlanType(e.target.value);
  };

  const handleDayTypeChange = e => {
    setDayType(e.target.value);
  };

  const handleDifficultyChange = e => {
    setDifficulty(e.target.value);
  };

  const handleSaveTemplate = async event => {
    event.preventDefault();
    // Perform the POST API call to save the new template
    // Replace with your actual API call logic
    // ...

    // After saving, redirect back to the WorkoutPage
    navigate('/workouts');
  };

  const handleCancel = () => {
    // Redirect to the create workout page
    navigate('/workouts');
  };

  return (
    <div className='page-layout'>
      <h1 className='page-title'>Create New Template</h1>
      <form onSubmit={handleSaveTemplate}>
        <div>
          <Input
            label='Template Name'
            value={templateName}
            onChange={e => setTemplateName(e.target.value)}
          />
          <label htmlFor='plan-type'>Plan Type: </label>
          <select
            id='plan-type'
            value={planType}
            onChange={handlePlanTypeChange}
          >
            <option value='General'>General</option>
            <option value='Bulking'>Bulking</option>
            <option value='Cutting'>Cutting</option>
            <option value='Sport'>Sport</option>
          </select>
          <label htmlFor='plan-type'>Workout Day Type: </label>
          <select id='day-type' value={dayType} onChange={handleDayTypeChange}>
            <option value='Day of Week'>ay of Week</option>
            <option value='Numerical'>Numerical</option>
          </select>
          <label htmlFor='difficulty-level'>Difficulty Level</label>
          <select
            id='difficulty-level'
            value={difficulty}
            onChange={handleDifficultyChange}
          >
            <option value='Beginner'>Beginner</option>
            <option value='Intermediate'>Intermediate</option>
            <option value='Advance'>Advance</option>
          </select>
        </div>
        {/* Add form elements for exercise selection here */}
        <div>
          <button type='submit'>Save Template</button>
          <button type='cancel' onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTemplatePage;
