import React, { useContext, useState } from 'react';
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

const Workout = ({ workoutId, isExpanded, onToggleExpand }) => {
  const { program, deleteWorkout, deleteExercise, updateWorkout, addSet } =
    useContext(ProgramContext);
  const [isEditing, setIsEditing] = useState(false);
  const [workoutTitle, setWorkoutTitle] = useState('');
  const { theme } = useTheme();

  const workout = program.workouts.find(w => w.id === workoutId);

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
  };

  const handleDeleteExercise = (workoutId, exerciseId) => {
    deleteExercise(workoutId, exerciseId);
  };

  const handleWorkoutExpand = () => {
    onToggleExpand(workoutId);
  };

  const handleAddSet = (workoutId, exerciseId) => {
    const activeWorkout = program.workouts.find(w => w.id === workoutId);
    const exercise = activeWorkout?.exercises.find(e => e.id === exerciseId);

    if (exercise && exercise.sets) {
      const newSet = {
        weight: '',
        reps: '',
        order: exercise.sets.length + 1
      };
      addSet(workoutId, exerciseId, newSet);
    }
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
    navigate('/select-exercises', {
      state: { workoutId: workoutId }
    });
  };

  return (
    <div
      className={`workout ${theme} ${workout.id === workoutId ? 'active' : ''}`}
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
            <h2 className={`workout__title ${theme}`}>{workout.name}</h2>
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
            {workout.exercises && workout.exercises.length > 0 ? (
              workout.exercises.map((exercise, index) => (
                <div key={exercise.tempId} className='workout__each-exercise'>
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
                    {exercise.sets && exercise.sets.length > 0 ? (
                      exercise.sets.map(set => (
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
