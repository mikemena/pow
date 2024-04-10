import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoIosArrowDown } from 'react-icons/io';
import { ProgramContext } from '../../contexts/programContext';
import Button from '../../components/Inputs/Button';
import './programForm.css';
import { GOAL_TYPES, DURATION_TYPES } from '../../utils/constants';
import { toProperCase } from '../../utils/stringUtils';
import { useTheme } from '../../contexts/themeContext';

const ProgramForm = ({ isEditing }) => {
  const { theme } = useTheme();
  const navigate = useNavigate();

  // Access program data and functions from ProgramContext
  const { program, addWorkout, saveProgram } = useContext(ProgramContext);

  const [formValues, setFormValues] = useState({
    programName: program?.name || '',
    mainGoal: program?.main_goal || '',
    programDuration: program?.program_duration || '',
    durationUnit: program?.duration_unit || '',
    daysPerWeek: program?.days_per_week || '',
    workouts: program?.workouts || [],
    programDurationDisplay: `${program?.program_duration || ''} ${
      toProperCase(program?.duration_unit) || ''
    }`
  });

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
    saveProgram(formValues);
  };

  const handleCancel = () => {
    // Redirect to the create workout page
    navigate('/');
  };

  const handleAddWorkout = event => {
    event.preventDefault();
    addWorkout(program.workouts);
  };

  return (
    <form className={`prog-container ${theme}`} onSubmit={handleSubmit}>
      <div className='prog-container__section'>
        {isEditing ? (
          <>
            <label
              htmlFor='programName'
              className={`prog-container__section-title ${theme}`}
            >
              Program Name
            </label>
            <textarea
              type='text'
              className={`program-name-input ${theme}`}
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
        <label
          htmlFor='mainGoal'
          className={`prog-container__section-title ${theme}`}
        >
          Main Goal
        </label>
        {isEditing ? (
          <select
            className={`mainGoal ${theme}`}
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
          className={`prog-container__section-title ${theme}`}
        >
          Duration
        </label>
        {isEditing ? (
          <>
            <input
              type='number'
              className={`programDuration ${theme}`}
              name='programDuration'
              value={formValues.programDuration}
              onChange={handleChange}
              min={1}
            />
            <select
              className={`durationUnit ${theme}`}
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
        <label
          htmlFor='daysPerWeek'
          className={`prog-container__section-title ${theme}`}
        >
          Days Per Week
        </label>
        {isEditing ? (
          <input
            type='number'
            className={`daysPerWeek  ${theme}`}
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
    </form>
  );
};

export default ProgramForm;
