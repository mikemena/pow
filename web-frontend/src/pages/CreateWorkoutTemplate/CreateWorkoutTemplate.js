import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../../components/Inputs/Input';
import Dropdown from '../../components/Inputs/Dropdown';
import Button from '../../components/Inputs/Button';

const CreateTemplatePage = () => {
  const [templateName, setTemplateName] = useState('');
  const [planType, setPlanType] = useState('General');
  const [dayType, setDayType] = useState('Day of Week');
  const [difficulty, setDifficulty] = useState('Intermediate');

  const navigate = useNavigate();

  const handlePlanTypeChange = selectedPlanType => {
    setPlanType(selectedPlanType);
  };

  const handleDayTypeChange = selectedDayType => {
    setDayType(selectedDayType);
  };

  const handleDifficultyChange = selectedDifficulty => {
    setDifficulty(selectedDifficulty);
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
          <Dropdown
            id='day-type'
            label='Workout Day Type'
            options={['Day of Week', 'Numerical']}
            onSelect={handleDayTypeChange}
          />
          <Dropdown
            id='plan-type'
            label='Plan Type'
            options={['General', 'Bulking', 'Cutting', 'Sport']}
            onSelect={handlePlanTypeChange}
          />

          <Dropdown
            id='difficulty-level'
            label='Difficulty Level'
            options={['Beginner', 'Intermediate', 'Advance']}
            onSelect={handleDifficultyChange}
          />
        </div>

        {/* Add form elements for exercise selection here */}
        <div>
          <Button onClick={handleSaveTemplate}>Save Template</Button>
          <Button onClick={handleCancel}>Cancel</Button>
        </div>
      </form>
    </div>
  );
};

export default CreateTemplatePage;
