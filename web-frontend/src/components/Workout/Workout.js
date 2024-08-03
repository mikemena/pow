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

const Workout = ({ workout, isEditing, isExpanded, onToggleExpand }) => {
  console.log('Workout component rendered with workout:', workout);
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
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [workoutTitle, setWorkoutTitle] = useState(workout.name);
  const { theme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    if (workout) {
      setWorkoutTitle(workout.name);
    }
  }, [workout]);

  const handleEditTitleChange = e => {
    setIsEditingTitle(true);
    setWorkoutTitle(e.target.value);
  };

  const handleSaveTitle = () => {
    if (workout) {
      const updatedWorkout = { ...workout, name: workoutTitle };
      updateWorkout(updatedWorkout);
    }
    setIsEditingTitle(false);
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
    if (isEditing) {
      const updatedWorkout = {
        ...workout,
        exercises: workout.exercises.map(ex =>
          ex.id === exerciseId
            ? {
                ...ex,
                sets: [
                  ...ex.sets,
                  {
                    id: Date.now(),
                    order: ex.sets.length + 1,
                    weight: '',
                    reps: ''
                  }
                ]
              }
            : ex
        )
      };
      updateWorkout(updatedWorkout);
    } else {
      addSet(workoutId, exerciseId);
    }
  };

  const handleAddExercises = workoutId => {
    setActiveWorkout(workoutId);
    const selectedExercises = isEditing
      ? workout.exercises || []
      : state.exercises[workoutId] || [];
    console.log(
      'Navigating to select-exercises with selected exercises:',
      selectedExercises
    );
    navigate('/select-exercises', {
      state: { workoutId, selectedExercises, isEditing }
    });
  };

  const handleChange = (updatedValue, exercise, set) => {
    if (isEditing) {
      const updatedWorkout = {
        ...workout,
        exercises: workout.exercises.map(ex =>
          ex.id === exercise.id
            ? {
                ...ex,
                sets: ex.sets.map(s =>
                  s.id === set.id ? { ...s, ...updatedValue } : s
                )
              }
            : ex
        )
      };
      updateWorkout(updatedWorkout);
    } else {
      updateSet(workout.id, exercise.id, { ...set, ...updatedValue });
    }
  };

  const handleDeleteSet = (workoutId, exerciseId, setId) => {
    if (isEditing) {
      const updatedWorkout = {
        ...workout,
        exercises: workout.exercises.map(ex =>
          ex.id === exerciseId
            ? {
                ...ex,
                sets: ex.sets.filter(s => s.id !== setId)
              }
            : ex
        )
      };
      updateWorkout(updatedWorkout);
    } else {
      deleteSet(workoutId, exerciseId, setId);
    }
  };

  const workoutExercises = useMemo(() => {
    if (isEditing && workout.exercises) {
      return workout.exercises;
    } else if (
      state.workouts[workout.id] &&
      state.workouts[workout.id].exercises
    ) {
      return state.workouts[workout.id].exercises;
    }
    return [];
  }, [isEditing, workout, state.workouts]);

  const allSets = useMemo(() => {
    console.log('workoutExercises:', workoutExercises);
    return workoutExercises.map(exercise => ({
      ...exercise,
      sets: isEditing
        ? exercise.sets || []
        : state.sets && state.sets[exercise.id]
        ? state.sets[exercise.id]
        : []
    }));
  }, [isEditing, workoutExercises, state.sets]);

  const exerciseText = count => {
    if (count === 0) return 'No Exercises';
    if (count === 1) return '1 Exercise';
    return `${count} Exercises`;
  };

  const exerciseCount = workoutExercises.length;

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
          {isEditingTitle ? (
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
                onClick={() => setIsEditingTitle(false)}
                size={25}
              />
            </div>
          ) : (
            <h2 className={`workout__title ${theme}`}>{workoutTitle}</h2>
          )}
          {isExpanded && !isEditingTitle && (
            <TbPencil
              className={`workout__icon pencil-icon ${theme}`}
              onClick={() => setIsEditingTitle(true)}
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
                        {exercise.order}
                      </span>
                    </div>
                    <div className='workout__exercise-details'>
                      <h4 className={`workout__exercises_name ${theme}`}>
                        {exercise.name}
                      </h4>
                      <h5 className={`workout__exercise-muscle ${theme}`}>
                        {exercise.muscle}
                      </h5>
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
                  <button
                    onClick={() => handleAddSet(workout.id, exercise.id)}
                    className='workout__add-set-btn'
                  >
                    <MdAddBox size={25} />
                  </button>
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
                  <div className='workout__blank'></div>
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
                  <div className='workout__blank'></div>
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
                  <div className='workout__blank'></div>
                </div>

                <div className='workout__exercise-controls'>
                  <div className={`workout__drag-handle ${theme}`}>
                    <MdDragHandle size={25} />
                  </div>
                  <button
                    className='workout__remove-exercise-btn'
                    onClick={() =>
                      handleDeleteExercise(workout.id, exercise.id)
                    }
                  >
                    <TbHttpDelete size={30} />
                  </button>
                </div>
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
