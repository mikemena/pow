import React, { useContext, useState, useEffect } from 'react';
import { TbPencil } from 'react-icons/tb';
import { BsChevronCompactUp, BsChevronCompactDown } from 'react-icons/bs';
import { IoCloseCircleSharp, IoCheckmarkCircleSharp } from 'react-icons/io5';
import { MdDragHandle, MdAddBox } from 'react-icons/md';
import { GrClose } from 'react-icons/gr';
import { TbHttpDelete } from 'react-icons/tb';
import { ProgramContext } from '../../contexts/programContext';
import { useTheme } from '../../contexts/themeContext';
import { useNavigate } from 'react-router-dom';
import ExerciseSet from '../ExerciseSet/ExerciseSet';

import './Workout.css';

const Workout = ({ workout, isExpanded, onToggleExpand }) => {
  const {
    state,
    deleteWorkout,
    deleteExercise,
    updateWorkout,
    addSet,
    activeWorkout,
    setActiveWorkout
  } = useContext(ProgramContext);
  const [isEditing, setIsEditing] = useState(false);
  const [workoutTitle, setWorkoutTitle] = useState('');
  const { theme } = useTheme();

  useEffect(() => {
    if (workout) {
      setWorkoutTitle(workout.name);
    }
  }, [workout]);

  useEffect(() => {
    console.log('UseEffect- Workout component state:', state);
  }, [state]);

  const navigate = useNavigate();

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
    // Update active workout if the deleted one was active
    if (activeWorkout && activeWorkout === workoutId) {
      setActiveWorkout(null);
    }
  };

  const handleDeleteExercise = (workoutId, exerciseId) => {
    deleteExercise(workoutId, exerciseId);
  };

  const handleWorkoutExpand = () => {
    onToggleExpand(workout.id);
    // Set as active workout when expanded
    if (!activeWorkout || activeWorkout !== workout.id) {
      setActiveWorkout(workout.id);
    }
  };

  const handleAddSet = (workoutId, exerciseId) => {
    console.log('Adding new set for exercise:', exerciseId);
    addSet(workoutId, exerciseId);
  };

  const exerciseText = workout => {
    const count = workout?.exercises?.length ?? 0;

    if (count === 0) {
      return 'No Exercises ';
    } else if (count === 1) {
      return '1 Exercise ';
    } else {
      return `${count} Exercises `;
    }
  };

  if (!workout) return null;

  const handleAddExercises = workoutId => {
    // Set the workout as active
    setActiveWorkout(workoutId);
    // Navigate to the select exercises page
    navigate('/select-exercises');
  };

  const workoutExercises = state.exercises[workout.id] || [];

  console.log({ 'workout exercises': workoutExercises });
  console.log('Workout component state:', state);

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
          {exerciseText(workout)}
        </span>
        <button
          onClick={() => handleAddExercises(workout.id)}
          className='workout__add-exercise-btn'
        >
          Add
        </button>
      </div>
      {isExpanded && (
        <div className='workout__body'>
          <div className='workout__exercises'>
            <div className='workout__exercises-header-container'>
              <h4 className={`workout__exercises_header ${theme}`}>Exercise</h4>
              <h4 className={`workout__exercises_header ${theme}`}>Set</h4>
              <h4 className={`workout__exercises_header ${theme}`}>Weight</h4>
              <h4 className={`workout__exercises_header ${theme}`}>Reps</h4>
            </div>
            {workoutExercises.length > 0 ? (
              workoutExercises.map((exercise, index) => (
                <div key={exercise.id} className='workout__each-exercise'>
                  <div className={`workout__drag-order-container ${theme}`}>
                    <span className={`workout__exercise-order-number ${theme}`}>
                      {index + 1}
                    </span>{' '}
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
                  <div>
                    {state.sets[exercise.id] &&
                    state.sets[exercise.id].length > 0 ? (
                      state.sets[exercise.id].map(set => (
                        <div className='workout__sets-column' key={set.id}>
                          <ExerciseSet
                            id={set.id}
                            setDetails={set}
                            workoutId={workout.id}
                            exerciseId={exercise.id}
                          />
                        </div>
                      ))
                    ) : (
                      <p className='workout__no-exercise-message'>
                        No sets added
                      </p>
                    )}

                    <button
                      onClick={() => handleAddSet(workout.id, exercise.id)}
                      className='workout__add-set-btn'
                    >
                      <MdAddBox size={25} />
                    </button>
                  </div>
                  {/* delete exercise button */}
                  <button
                    className='workout__remove-exercise-btn'
                    id={`remove-exercise-btn-${exercise.id}`}
                    type='button'
                    onClick={() =>
                      handleDeleteExercise(workout.id, exercise.id)
                    }
                  >
                    <TbHttpDelete size={30} />
                  </button>
                </div>
              ))
            ) : (
              <p className='workout__no-exercise-message'>No exercises added</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Workout;
