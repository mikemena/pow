import React, { useContext, useState, useEffect, useMemo } from 'react';
import { TbPencil } from 'react-icons/tb';
import { BsChevronCompactUp, BsChevronCompactDown } from 'react-icons/bs';
import { IoCloseCircleSharp, IoCheckmarkCircleSharp } from 'react-icons/io5';
import { MdDragHandle, MdAddBox } from 'react-icons/md';
import { RiDeleteBack2Fill } from 'react-icons/ri';
import { GrClose } from 'react-icons/gr';
import { TbHttpDelete } from 'react-icons/tb';
import TextInput from '../Inputs/TextInput';
import { ProgramContext } from '../../contexts/programContext';
import { useTheme } from '../../contexts/themeContext';
import { useNavigate } from 'react-router-dom';

import './Workout.css';

const Workout = ({ workout, isExpanded, onToggleExpand }) => {
  const {
    state,
    deleteWorkout,
    deleteExercise,
    updateWorkout,
    addSet,
    activeWorkout,
    setActiveWorkout,
    updateSet,
    deleteSet
  } = useContext(ProgramContext);
  const [isEditing, setIsEditing] = useState(false);
  const [workoutTitle, setWorkoutTitle] = useState(workout.name);
  const { theme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    if (workout) {
      setWorkoutTitle(workout.name);
    }
  }, [workout]);

  useEffect(() => {
    console.log('UseEffect- Workout component state:', state);
  }, [state]);

  const handleEditTitleChange = e => {
    setIsEditing(true);
    setWorkoutTitle(e.target.value);
  };

  const handleSaveTitle = () => {
    if (workout) {
      const updatedWorkout = { ...workout, name: workoutTitle };
      updateWorkout(updatedWorkout);
    }
    setIsEditing(false);
  };

  const handleCloseTitleChange = () => {
    setIsEditing(false);
  };

  const handleDeleteWorkout = workoutId => {
    deleteWorkout(workoutId);
    if (activeWorkout === workoutId) {
      setActiveWorkout(null);
    }
  };

  const handleDeleteExercise = (workoutId, exerciseId) => {
    deleteExercise(workoutId, exerciseId);
  };

  const handleWorkoutExpand = () => {
    onToggleExpand(workout.id);
    if (activeWorkout !== workout.id) {
      setActiveWorkout(workout.id);
    }
  };

  const handleAddSet = (workoutId, exerciseId) => {
    console.log('Adding new set for exercise:', exerciseId);
    addSet(workoutId, exerciseId);
  };

  const handleAddExercises = workoutId => {
    setActiveWorkout(workoutId);
    navigate('/select-exercises');
  };

  const handleChange = (updatedValue, exercise, set) => {
    console.log('Updating set:', updatedValue);
    updateSet(workout.id, exercise.id, { ...set, ...updatedValue });
  };

  const handleDeleteSet = (workoutId, exerciseId, setId) => {
    console.log('Deleting set with id:', setId);
    deleteSet(workoutId, exerciseId, setId);
  };

  const workoutExercises = useMemo(
    () => state.exercises[workout.id] || [],
    [state.exercises, workout.id]
  );

  const allSets = useMemo(() => {
    return workoutExercises.map(exercise => {
      return {
        ...exercise,
        sets: [...(exercise.sets || []), ...(state.sets[exercise.id] || [])]
      };
    });
  }, [workoutExercises, state.sets]);

  const exerciseText = count => {
    if (count === 0) return 'No Exercises';
    if (count === 1) return '1 Exercise';
    return `${count} Exercises`;
  };

  const exerciseCount = workoutExercises.length;
  console.log('count exercises:', exerciseCount);

  console.log('allSets:', allSets);

  const totalSetsCount = allSets.reduce((total, exercise) => {
    return total + (exercise.sets ? exercise.sets.length : 0);
  }, 0);

  console.log('Total sets count:', totalSetsCount);

  return (
    <div
      className={`workout ${theme} ${
        activeWorkout === workout.id ? 'active' : ''
      }`}
    >
      <div className='workout__header'>
        <button className='workout__expand-btn' onClick={handleWorkoutExpand}>
          {isExpanded ? (
            <BsChevronCompactUp
              className={`workout__icon ${theme}`}
              size={30}
            />
          ) : (
            <BsChevronCompactDown
              className={`workout__icon ${theme}`}
              size={30}
            />
          )}
        </button>
        <div className='workout__title-container'>
          {isEditing ? (
            <div>
              <input
                className={`workout__title-input ${theme}`}
                type='text'
                value={workoutTitle}
                onChange={handleEditTitleChange}
                placeholder='Enter Workout Title'
              />
              <IoCheckmarkCircleSharp
                className={`workout__icon ${theme}`}
                onClick={handleSaveTitle}
                size={25}
              />
              <IoCloseCircleSharp
                className={`workout__icon ${theme}`}
                onClick={handleCloseTitleChange}
                size={25}
              />
            </div>
          ) : (
            <h2 className={`workout__title ${theme}`}>{workoutTitle}</h2>
          )}
          {isExpanded && !isEditing && (
            <TbPencil
              className={`workout__icon pencil-icon ${theme}`}
              onClick={() => setIsEditing(true)}
              size={25}
            />
          )}
          <button
            className='workout__delete-btn'
            onClick={() => handleDeleteWorkout(workout.id)}
          >
            <GrClose className={`workout__icon ${theme}`} size={20} />
          </button>
        </div>
      </div>
      <div className='workout__subtitle'>
        <span className={`workout__exercise-count ${theme}`}>
          {exerciseText(exerciseCount)}
        </span>
        <button
          onClick={() => handleAddExercises(workout.id)}
          className='workout__add-exercise-btn'
        >
          Add
        </button>
      </div>
      {isExpanded && (
        <div className='workout__exercises'>
          <div className='workout__exercises-header-container'>
            <h4 className={`workout__exercises_header ${theme}`}>Exercise</h4>
            <h4 className={`workout__exercises_header ${theme}`}>Set</h4>
            <h4 className={`workout__exercises_header ${theme}`}>Weight</h4>
            <h4 className={`workout__exercises_header ${theme}`}>Reps</h4>
          </div>
          {workoutExercises.length > 0 ? (
            allSets.map((exercise, index) => (
              <div key={exercise.id} className='workout__each-exercise'>
                <div className='workout__exercise-column'>
                  <div className='workout__exercise-info'>
                    <div className={`workout__drag-order-container ${theme}`}>
                      <span
                        className={`workout__exercise-order-number ${theme}`}
                      >
                        {index + 1}
                      </span>
                      <MdDragHandle
                        size={25}
                        className='workout__exercise-drag'
                      />
                    </div>
                    <div className='workout__exercise-details'>
                      <h4 className={`workout__exercises_name ${theme}`}>
                        {exercise.name}
                      </h4>
                      <p className={`workout__exercise-muscle ${theme}`}>
                        {exercise.muscle}
                      </p>
                    </div>
                  </div>
                </div>
                <div className='workout__sets-column'>
                  {exercise.sets &&
                    exercise.sets.length > 0 &&
                    exercise.sets.map(set => (
                      <div key={set.id} className='workout__set'>
                        <p className={`workout__set-order-number ${theme}`}>
                          {set.order}
                        </p>
                      </div>
                    ))}
                </div>

                <div className='workout__weights-column'>
                  {exercise.sets && exercise.sets.length > 0
                    ? exercise.sets.map(set => (
                        <div key={set.id} className='workout__set'>
                          <TextInput
                            className={`workout__set-weight ${theme}`}
                            id='set-weight'
                            onChange={e =>
                              handleChange(
                                { weight: e.target.value },
                                exercise,
                                set
                              )
                            }
                            value={set.weight}
                            type='number'
                          />
                        </div>
                      ))
                    : null}
                </div>

                <div className='workout__reps-column'>
                  {exercise.sets && exercise.sets.length > 0
                    ? exercise.sets.map((set, setIndex) => (
                        <div key={set.id} className='workout__set'>
                          <TextInput
                            className={`workout__set-reps ${theme}`}
                            onChange={e =>
                              handleChange(
                                { reps: e.target.value },
                                exercise,
                                set
                              )
                            }
                            value={set.reps}
                            type='number'
                          />
                        </div>
                      ))
                    : null}
                </div>
                <div className='workout__delete-set-column'>
                  {exercise.sets && exercise.sets.length > 0
                    ? exercise.sets.map((set, setIndex) => (
                        <div key={set.id} className='workout__set'>
                          {setIndex > 0 ? (
                            <button
                              onClick={() =>
                                handleDeleteSet(workout.id, exercise.id, set.id)
                              }
                              className='workout__delete-set-btn'
                            >
                              <RiDeleteBack2Fill size={25} />
                            </button>
                          ) : (
                            <div className='workout__set'>
                              <div className='workout__no-delete-set-btn' />
                            </div>
                          )}
                        </div>
                      ))
                    : null}
                </div>

                <button
                  onClick={() => handleAddSet(workout.id, exercise.id)}
                  className='workout__add-set-btn'
                >
                  <MdAddBox size={25} />
                </button>

                <button
                  className='workout__remove-exercise-btn'
                  id={`remove-exercise-btn-${exercise.id}`}
                  type='button'
                  onClick={() => handleDeleteExercise(workout.id, exercise.id)}
                >
                  <TbHttpDelete size={30} />
                </button>
              </div>
            ))
          ) : (
            <p className='workout__no-exercise-message'>No exercises added</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Workout;
