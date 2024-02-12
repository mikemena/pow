import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateTemplatePage = () => {
  const [templateName, setTemplateName] = useState('');
  const navigate = useNavigate();

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
    <div>
      <h1>Create New Template</h1>
      <form onSubmit={handleSaveTemplate}>
        <div>
          <label>
            Template Name:
            <input
              type='text'
              value={templateName}
              onChange={e => setTemplateName(e.target.value)}
            />
          </label>
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
