import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import {
  TbLayoutNavbarExpandFilled,
  TbLayoutBottombarExpandFilled,
  TbPencil
} from 'react-icons/tb';
import { IoCloseCircleSharp, IoCheckmarkCircleSharp } from 'react-icons/io5';
import { MdDelete, MdDragHandle } from 'react-icons/md';
import Button from '../Inputs/Button';
import { WorkoutContainerContext } from '../../contexts/workoutContainerContext';
import { ProgramContext } from '../../contexts/programContext';
import ExerciseSet from '../ExerciseSet/ExerciseSet';
import './WorkoutContainer.css';

const WorkoutContainer = ({
  workout,
  isActive,
  showExercises,
  showExerciseList
}) => {
  const { expandedWorkoutId, toggleExpand } = useContext(
    WorkoutContainerContext
  );
  const { deleteWorkout, deleteExercise, updateWorkout } =
    useContext(ProgramContext);
  const isExpanded = expandedWorkoutId === workout.id;

  const [isEditing, setIsEditing] = useState(false);
  const [workoutTitle, setWorkoutTitle] = useState(workout.name);

  const handleEditTitleChange = e => {
    setIsEditing(true);
    setWorkoutTitle(e.target.value);
  };

  const handleSaveTitle = () => {
    updateWorkout({ ...workout, name: workoutTitle });
    setIsEditing(false);
  };

  const handleCloseTitleChange = e => {
    setIsEditing(false);
  };

  const handleDeleteWorkout = () => {
    deleteWorkout(workout.id);
  };

  const handleDeleteExercise = (workoutId, exerciseId) => {
    deleteExercise(workoutId, exerciseId);
  };

  const workoutContainerClass = isActive
    ? 'workout-container active'
    : 'workout-container';

  const toggleWorkoutExpand = () => {
    toggleExpand(workout.id);
  };

  return (
    <>
      <div className={workoutContainerClass}>
        <div
          className='workout-container__header'
          onClick={toggleWorkoutExpand}
        >
          <button
            className='workout-container__expand-btn'
            title='Expand/Collapse Workout'
          >
            {isExpanded ? (
              <TbLayoutBottombarExpandFilled size={20} />
            ) : (
              <TbLayoutNavbarExpandFilled size={20} />
            )}
          </button>

          {isEditing ? (
            <div className='workout-container__title_container'>
              <button
                className='workout-container__save-title-btn'
                onClick={handleSaveTitle}
              >
                <IoCheckmarkCircleSharp size={20} />
              </button>
              <input
                type='text'
                value={workoutTitle}
                onChange={handleEditTitleChange}
                placeholder='Enter Title'
              />
              <button
                className='workout-container__close-title-btn'
                onClick={handleCloseTitleChange}
              >
                <IoCloseCircleSharp size={20} />
              </button>
            </div>
          ) : (
            <div className='workout-container__title_container'>
              <button className='workout-container__edit-title-btn'>
                <TbPencil size={20} onClick={handleEditTitleChange} />
              </button>
              <h2 className='workout-container__title'>{workout.name}</h2>
            </div>
          )}

          <button
            className='workout-container__delete-btn'
            onClick={() => {
              const confirm = window.confirm(
                `Are you sure you want to remove ${workout.name}?`
              );
              if (confirm) {
                handleDeleteWorkout(workout.id);
              }
            }}
          >
            <MdDelete size={20} />
          </button>
        </div>
        {isExpanded && (
          <div className='workout-container__body'>
            <div className='workout-container__header'>
              <Button
                id='toggle-exercises-btn'
                onClick={() => showExercises(workout.id)}
                type='button'
                // bgcolor='#EAEAEA'
              >
                {isActive && showExerciseList
                  ? 'Hide Exercises'
                  : 'Show Exercise'}
              </Button>
            </div>
            <div className='workout-container__exercises'>
              <div className='workout-container__exercises-header-container'>
                <h4 className='workout-container__exercises_header'>
                  Exercise
                </h4>
                <h4 className='workout-container__exercises_header'>Set</h4>
                <h4 className='workout-container__exercises_header'>Weight</h4>
                <h4 className='workout-container__exercises_header'>Reps</h4>
              </div>
              {workout.exercises && workout.exercises.length > 0 ? (
                workout.exercises.map((exercise, index) => (
                  <div
                    key={exercise.tempId}
                    className='workout-container__each-exercise'
                  >
                    <div className='workout-container__drag-order-container'>
                      <span className='workout-container__exercise-order-number'>
                        {index + 1}
                      </span>{' '}
                      <MdDragHandle
                        size={25}
                        className='workout-container__exercise-drag'
                      />
                    </div>
                    <div className='workout-container__exercise-details'>
                      <h4 className='workout-container__exercise-name'>
                        {exercise.name}
                      </h4>
                      <p className='workout-container__exercise-muscle'>
                        {exercise.muscle}
                      </p>
                    </div>
                    {exercise.sets &&
                      exercise.sets.map(set => (
                        <ExerciseSet key={set.id} setDetails={set} />
                      ))}

                    <button
                      className='workout-container__remove-exercise-btn'
                      id={`remove-exercise-btn-${exercise.id}`}
                      type='button'
                      onClick={() =>
                        handleDeleteExercise(workout.id, exercise.id)
                      }
                    >
                      <MdDelete size={30} />
                    </button>
                  </div>
                ))
              ) : (
                <p className='workout-container__no-exercise-message'>
                  No exercises added
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

WorkoutContainer.propTypes = {
  onShowExercise: PropTypes.func.isRequired,
  showExerciseList: PropTypes.bool.isRequired
};

export default WorkoutContainer;
