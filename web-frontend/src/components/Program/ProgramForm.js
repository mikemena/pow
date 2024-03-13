import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Inputs/Button';
import './programForm.css';
import { GOAL_TYPES, DURATION_TYPES } from '../../utils/constants';

const ProgramForm = ({ program, onSubmit, isEditing, handleAddDay }) => {
  const navigate = useNavigate();

  console.log('Rendering ProgramForm component', program);
  const [formValues, setFormValues] = useState({
    programName: program?.name || '',
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
    // Dynamically set the height of .prog-container__lines
    var progContainer = document.querySelector('.prog-container');
    var progContainerLines = document.querySelector('.prog-container__lines');

    // Get the height of .prog-container
    var progContainerHeight = progContainer.offsetHeight;

    // Set the height of .prog-container__lines
    progContainerLines.style.height = progContainerHeight + 'px';

    setFormValues({
      programName: program?.name || '',
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
    let value = e.target.value;

    if (e.target.name === 'programDuration' && value < 1) {
      value = 1;
    }
    if (e.target.name === 'daysPerWeek' && value < 1) {
      value = 1;
    }

    setFormValues({
      ...formValues,
      [e.target.name]: value,
      programDurationDisplay: `${program?.programDuration || ''} ${
        program?.durationUnit || ''
      }`
    });
  };

  const handleSubmit = e => {
    e.preventDefault();
    onSubmit(formValues);
  };

  const handleCancel = () => {
    // Redirect to the create workout page
    navigate('/');
  };

  return (
    <form className='prog-container' onSubmit={handleSubmit}>
      <div className='prog-container__lines'></div>
      <div className='prog-container__section'>
        {isEditing ? (
          <>
            <label
              htmlFor='programName'
              className='prog-container__section-title'
            >
              Program Name
            </label>
            <textarea
              type='text'
              id='program-name-input'
              name='programName'
              value={formValues.name}
              onChange={handleChange}
              disabled={!isEditing}
              maxLength={84}
            />
          </>
        ) : (
          <span className='prog-container__section-text'>
            {formValues.programName}
          </span>
        )}
      </div>

      <div className='prog-container__section'>
        <label htmlFor='mainGoal' className='prog-container__section-title'>
          Main Goal
        </label>
        {isEditing ? (
          <select
            id='mainGoal'
            name='mainGoal'
            value={formValues.mainGoal}
            onChange={handleChange}
            disabled={!isEditing}
          >
            {GOAL_TYPES.map(goal => (
              <option key={goal.id} value={goal.value}>
                {goal.label}
              </option>
            ))}
          </select>
        ) : (
          <span className='prog-container__section-text'>
            {formValues.mainGoal}
          </span>
        )}
      </div>
      <div className='prog-container__section'>
        <label
          htmlFor='programDuration'
          className='prog-container__section-title'
        >
          Duration
        </label>
        {isEditing ? (
          <>
            <input
              type='number'
              id='programDuration'
              name='programDuration'
              value={formValues.programDuration}
              onChange={handleChange}
              min={1}
            />
            <select
              id='durationUnit'
              name='durationUnit'
              value={formValues.durationUnit}
              onChange={handleChange}
            >
              {DURATION_TYPES.map(duration => (
                <option key={duration.id} value={duration.value}>
                  {duration.label}
                </option>
              ))}
            </select>
          </>
        ) : (
          <span className='prog-container__section-text'>
            {formValues.programDurationDisplay}
          </span>
        )}
      </div>
      <div className='prog-container__section'>
        <label htmlFor='daysPerWeek' className='prog-container__section-title'>
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
            min={1}
          />
        ) : (
          <span className='prog-container__section-text'>
            {formValues.daysPerWeek}
          </span>
        )}
      </div>
      {isEditing && (
        <div className='prog-container__btn-container'>
          <Button type='button' onClick={handleAddDay}>
            Add Day
          </Button>
          <Button type='submit'>Save</Button>
          <Button type='button' onClick={handleCancel}>
            Cancel
          </Button>
        </div>
      )}
    </form>
  );
};

export default ProgramForm;
