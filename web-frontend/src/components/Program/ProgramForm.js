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
  const { updateProgramField } = useContext(ProgramContext);

  const [formValues, setFormValues] = useState({
    name: program?.name || '',
    main_goal: program?.main_goal || '',
    program_duration: program?.program_duration || '',
    duration_unit: program?.duration_unit || '',
    days_per_week: program?.days_per_week || '',
    workouts: program?.workouts || [],
    programDurationDisplay: `${program?.program_duration || ''} ${
      toUpperCase(program?.duration_unit) || ''
    }`
  });

  useEffect(() => {
    if (program) {
      setFormValues({
        name: program.name || '',
        main_goal: program.main_goal || '',
        program_duration: program.program_duration || '',
        duration_unit: program.duration_unit || '',
        days_per_week: program.days_per_week || '',
        workouts: program.workouts || [],
        programDurationDisplay: `${program.program_duration || ''} ${
          toUpperCase(program.duration_unit) || ''
        }`
      });
    }
  }, [program]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormValues(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBlur = e => {
    const { name, value } = e.target;
    updateProgramField(name, value);
  };

  // const handleSubmit = e => {
  //   const action = isNewProgram ? 'ADD_PROGRAM' : 'UPDATE_PROGRAM';
  //   e.preventDefault();
  //   dispatch({
  //     type: action,
  //     payload: {
  //       ...program,
  //       name: formValues.programName,
  //       main_goal: formValues.mainGoal,
  //       program_duration: formValues.programDuration,
  //       duration_unit: formValues.durationUnit,
  //       days_per_week: formValues.daysPerWeek
  //     }
  //   });
  // };

  const handleProgramExpand = () => {
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
        <h2 className={`program__title ${theme}`}>{formValues.name}</h2>
      </div>
      {isExpanded && (
        <div className='program__form'>
          <div className='program__section'>
            <label htmlFor='name' className={`program__section-title ${theme}`}>
              Program Name
            </label>
            <textarea
              type='text'
              className={`program-name-input ${theme}`}
              name='name'
              value={formValues.name}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={!isEditing}
              maxLength={84}
            />
          </div>
          <div className='program__section'>
            <label
              htmlFor='main_goal'
              className={`program__section-title ${theme}`}
            >
              Main Goal
            </label>
            <select
              className={`mainGoal ${theme}`}
              name='main_goal'
              value={formValues.main_goal}
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
              htmlFor='program_duration'
              className={`program__section-title ${theme}`}
            >
              Duration
            </label>
            <div className='input-select-container'>
              <input
                type='number'
                className={`programDuration ${theme}`}
                name='program_duration'
                value={formValues.program_duration}
                onChange={handleChange}
                onBlur={handleBlur}
                min={1}
              />
              <select
                className={`durationUnit ${theme}`}
                name='duration_unit'
                value={formValues.duration_unit}
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
              htmlFor='days_per_week'
              className={`program__section-title ${theme}`}
            >
              Days Per Week
            </label>
            <input
              type='number'
              className={`daysPerWeek  ${theme}`}
              name='days_per_week'
              value={formValues.days_per_week}
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
