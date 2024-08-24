import { useState, useContext, useEffect } from 'react';
import { ProgramContext } from '../../contexts/programContext';
import './programForm.css';
import { GOAL_TYPES, DURATION_TYPES } from '../../utils/constants';
import { BsChevronCompactUp, BsChevronCompactDown } from 'react-icons/bs';
import { toUpperCase } from '../../utils/stringUtils';
import { useTheme } from '../../contexts/themeContext';

const ProgramForm = ({
  program,
  isEditing,
  isNewProgram,
  isExpanded,
  onToggleExpand
}) => {
  const { theme } = useTheme();
  const { dispatch } = useContext(ProgramContext);

  const [formValues, setFormValues] = useState({
    programName: program?.name || '',
    mainGoal: program?.main_goal || '',
    programDuration: program?.program_duration || '',
    durationUnit: program?.duration_unit || '',
    daysPerWeek: program?.days_per_week || '',
    workouts: program?.workouts || [],
    programDurationDisplay: `${program?.program_duration || ''} ${
      toUpperCase(program?.duration_unit) || ''
    }`
  });

  useEffect(() => {
    if (program) {
      setFormValues({
        programName: program.name || '',
        mainGoal: program.main_goal || '',
        programDuration: program.program_duration || '',
        durationUnit: program.duration_unit || '',
        daysPerWeek: program.days_per_week || '',
        workouts: program.workouts || [],
        programDurationDisplay: `${program.program_duration || ''} ${
          toUpperCase(program.duration_unit) || ''
        }`
      });
    }
  }, [program]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormValues(prev => {
      const newValues = { ...prev, [name]: value };
      if (name === 'programDuration' || name === 'durationUnit') {
        newValues.programDurationDisplay = `${
          newValues.programDuration
        } ${toUpperCase(newValues.durationUnit)}`;
      }
      return newValues;
    });
  };

  const handleBlur = () => {
    const action = isNewProgram ? 'ADD_PROGRAM' : 'UPDATE_PROGRAM';

    if (!program) {
      console.error('Program is undefined, cannot dispatch action');
      return;
    }

    dispatch({
      type: action,
      payload: {
        ...program,
        name: formValues.programName,
        main_goal: formValues.mainGoal,
        program_duration: formValues.programDuration,
        duration_unit: formValues.durationUnit,
        days_per_week: formValues.daysPerWeek
      }
    });
  };

  const handleSubmit = e => {
    const action = isNewProgram ? 'ADD_PROGRAM' : 'UPDATE_PROGRAM';
    e.preventDefault();
    dispatch({
      type: action,
      payload: {
        ...program,
        name: formValues.programName,
        main_goal: formValues.mainGoal,
        program_duration: formValues.programDuration,
        duration_unit: formValues.durationUnit,
        days_per_week: formValues.daysPerWeek
      }
    });
  };

  const handleProgramExpand = () => {
    onToggleExpand(program);
  };

  return (
    <form onSubmit={handleSubmit} className={`program ${theme}`}>
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
              onBlur={handleBlur}
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
              onBlur={handleBlur}
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
            <div className='input-select-container'>
              <input
                type='number'
                className={`programDuration ${theme}`}
                name='programDuration'
                value={formValues.programDuration}
                onChange={handleChange}
                onBlur={handleBlur}
                min={1}
              />
              <select
                className={`durationUnit ${theme}`}
                name='durationUnit'
                value={formValues.durationUnit}
                onChange={handleChange}
                onBlur={handleBlur}
              >
                {DURATION_TYPES.map(duration => (
                  <option key={duration.id} value={duration.value}>
                    {duration.label}
                  </option>
                ))}
              </select>
            </div>
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
              onBlur={handleBlur}
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
