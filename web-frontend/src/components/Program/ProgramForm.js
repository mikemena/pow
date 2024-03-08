import { useState, useEffect } from 'react';
import './programForm.css';

const ProgramForm = ({ program, onSubmit, isEditing }) => {
  console.log('Rendering ProgramForm component', program);
  const [formValues, setFormValues] = useState({
    name: program?.name || '',
    mainGoal: program?.main_goal || '',
    programDuration: program?.program_duration || '',
    durationUnit: program?.duration_unit || '',
    daysPerWeek: program?.days_per_week || '',
    workouts: program?.workouts || [],
    programDurationDisplay: `${program?.program_duration || ''} ${
      program?.duration_unit || ''
    }`
  });

  useEffect(() => {
    setFormValues({
      name: program?.name || '',
      mainGoal: program?.main_goal || '',
      programDuration: program?.program_duration || '',
      durationUnit: program?.duration_unit || '',
      daysPerWeek: program?.days_per_week || '',
      workouts: program?.workouts || [],
      programDurationDisplay: `${program?.program_duration || ''} ${
        program?.duration_unit || ''
      }`
    });
  }, [program]);

  const handleChange = e => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
      programDurationDisplay: `${program?.programDuration || ''} ${
        program?.durationUnit || ''
      }`
    });
  };

  const handleSubmit = e => {
    e.preventDefault();
    onSubmit(formValues);
  };

  console.log('formValues.mainGoal:', formValues.mainGoal);

  console.log('formValues.name:', formValues.name);

  console.log(
    'formValues.programDurationDisplay:',
    formValues.programDurationDisplay
  );

  return (
    <form className='program-container' onSubmit={handleSubmit}>
      <div className='lines'></div>
      <div className='program-section-content'>
        {isEditing ? (
          <>
            <label htmlFor='programName' className='program-section-title'>
              Name
            </label>
            <input
              type='text'
              id='programName'
              name='programName'
              value={formValues.name}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </>
        ) : (
          <span className='program-section-text'>{formValues.name}</span>
        )}
      </div>

      <div className='program-section-content'>
        <label htmlFor='mainGoal' className='program-section-title'>
          Main Goal
        </label>
        {isEditing ? (
          <input
            type='text'
            id='mainGoal'
            name='mainGoal'
            value={formValues.mainGoal}
            onChange={handleChange}
            disabled={!isEditing}
          />
        ) : (
          <span className='program-section-text'>{formValues.mainGoal}</span>
        )}
      </div>
      <div className='program-section-content'>
        <label htmlFor='programDuration' className='program-section-title'>
          Program Duration
        </label>
        {isEditing ? (
          <>
            <input
              type='number'
              id='programDuration'
              name='programDuration'
              value={formValues.programDuration}
              onChange={handleChange}
            />
            <input
              type='text'
              id='durationUnit'
              name='durationUnit'
              value={formValues.durationUnit}
              onChange={handleChange}
            />
          </>
        ) : (
          <span className='program-section-text'>
            {formValues.programDurationDisplay}
          </span>
        )}
      </div>
      <div className='program-section-content'>
        <label htmlFor='daysPerWeek' className='program-section-title'>
          Days Per Week
        </label>
        {isEditing ? (
          <input
            type='number'
            id='daysPerWeek'
            name='daysPerWeek'
            value={formValues.daysPerWeek}
            onChange={handleChange}
            disabled={!isEditing}
          />
        ) : (
          <span className='program-section-text'>{formValues.daysPerWeek}</span>
        )}
      </div>
      {isEditing && <button type='submit'>Save</button>}
    </form>
  );
};

export default ProgramForm;
