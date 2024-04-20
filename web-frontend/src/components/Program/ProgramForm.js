import { useState, useContext } from 'react';
import { ProgramContext } from '../../contexts/programContext';
import './programForm.css';
import { GOAL_TYPES, DURATION_TYPES } from '../../utils/constants';
import { BsChevronCompactUp, BsChevronCompactDown } from 'react-icons/bs';
import { toProperCase } from '../../utils/stringUtils';
import { useTheme } from '../../contexts/themeContext';

const ProgramForm = ({ isEditing, isExpanded, onToggleExpand }) => {
  const { theme } = useTheme();

  // Access program data and functions from ProgramContext
  const { program } = useContext(ProgramContext);

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

  const handleProgramExpand = () => {
    console.log('handleProgramExpand called');
    onToggleExpand(program);
  };

  return (
    <form className={`program ${theme}`}>
      <div className='program__header'>
        <button
          type='button'
          className={`program__expand-btn ${theme}`}
          onClick={handleProgramExpand}
        >
          {isExpanded ? (
            <BsChevronCompactUp
              className={`program__icon ${theme}`}
              size={30}
            />
          ) : (
            <BsChevronCompactDown
              className={`program__icon ${theme}`}
              size={30}
            />
          )}
        </button>
        <h2 className={`program__title ${theme}`}>{formValues.programName}</h2>
      </div>
      {isExpanded && (
        <div className='program__form'>
          <div className='program__section'>
            <label
              htmlFor='programName'
              className={`program__section-title ${theme}`}
            >
              Program Name
            </label>
            <textarea
              type='text'
              className={`program-name-input ${theme}`}
              name='programName'
              value={formValues.programName}
              onChange={handleChange}
              disabled={!isEditing}
              maxLength={84}
            />
          </div>
          <div className='program__section'>
            <label
              htmlFor='mainGoal'
              className={`program__section-title ${theme}`}
            >
              Main Goal
            </label>
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
          </div>
          <div className='program__section' id='program-duration-section'>
            <label
              htmlFor='programDuration'
              className={`program__section-title ${theme}`}
            >
              Duration
            </label>
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
          </div>
          <div className='program__section'>
            <label
              htmlFor='daysPerWeek'
              className={`program__section-title ${theme}`}
            >
              Days Per Week
            </label>
            <input
              type='number'
              className={`daysPerWeek  ${theme}`}
              name='daysPerWeek'
              value={formValues.daysPerWeek}
              onChange={handleChange}
              disabled={!isEditing}
              min={1}
            />
          </div>
        </div>
      )}
    </form>
  );
};

export default ProgramForm;
