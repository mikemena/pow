import React, { useState, useEffect } from 'react';

const ProgramForm = ({ program, onSubmit, isEditing }) => {
  console.log('Rendering ProgramForm component', program);
  const [formValues, setFormValues] = useState({
    name: program?.name || '',
    mainGoal: program?.main_goal || '',
    programDuration: program?.duration_unit || '',
    durationUnit: program?.durationUnit || '',
    daysPerWeek: program?.days_per_week || '',
    workouts: program?.workouts || []
  });

  useEffect(() => {
    setFormValues({
      name: program?.name || '',
      mainGoal: program?.main_goal || '',
      programDuration: program?.program_duration || '',
      durationUnit: program?.duration_unit || '',
      daysPerWeek: program?.days_per_week || '',
      workouts: program?.workouts || []
    });
  }, [program]);

  const handleChange = e => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = e => {
    e.preventDefault();
    onSubmit(formValues);
  };

  console.log('formValues.mainGoal:', formValues.mainGoal);

  console.log('formValues.name:', formValues.name);

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor='mainGoal'>Main Goal</label>
        <input
          type='text'
          id='mainGoal'
          name='mainGoal'
          value={formValues.mainGoal}
          onChange={handleChange}
          disabled={!isEditing}
        />
      </div>
      <div>
        <label htmlFor='programDuration'>Program Duration</label>
        <input
          type='number'
          id='programDuration'
          name='programDuration'
          value={formValues.programDuration}
          onChange={handleChange}
          disabled={!isEditing}
        />
      </div>
      <div>
        <label htmlFor='daysPerWeek'>Days Per Week</label>
        <input
          type='number'
          id='daysPerWeek'
          name='daysPerWeek'
          value={formValues.daysPerWeek}
          onChange={handleChange}
          disabled={!isEditing}
        />
      </div>
      {isEditing && <button type='submit'>Save</button>}
    </form>
  );
};

export default ProgramForm;
