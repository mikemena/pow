import React, { useContext, useState } from 'react';
import { TbPencil } from 'react-icons/tb';
import { BsChevronCompactUp, BsChevronCompactDown } from 'react-icons/bs';
import { IoCloseCircleSharp, IoCheckmarkCircleSharp } from 'react-icons/io5';
import { MdDragHandle, MdAddBox } from 'react-icons/md';
import { GrClose } from 'react-icons/gr';
import { TbHttpDelete } from 'react-icons/tb';
import Button from '../Inputs/Button';
import { WorkoutContainerContext } from '../../contexts/workoutContext';
import { ProgramContext } from '../../contexts/programContext';
import { useTheme } from '../../contexts/themeContext';
import ExerciseSet from '../ExerciseSet/ExerciseSet';
import './WorkoutContainer.css';

const Workout = ({
  activeWorkoutId,
  onWorkoutChange,
  showExercises,
  showExerciseList
}) => {
  const { expandedWorkoutId, toggleExpand } = useContext(
    WorkoutContainerContext
  );

  const { program, deleteWorkout, deleteExercise, updateWorkout, addSet } =
    useContext(ProgramContext);
  const [isEditing, setIsEditing] = useState(false);
  const isExpanded = expandedWorkoutId === activeWorkoutId;
  const [workoutTitle, setWorkoutTitle] = useState('');
  const { theme } = useTheme();

  const workouts = program.workouts; // Get the workouts from the program

  const handleEditTitleChange = e => {
    setIsEditing(true);
    setWorkoutTitle(e.target.value);
  };

  const handleSaveTitle = () => {
    // Find the workout that matches the activeWorkoutId
    const workoutToUpdate = workouts.find(
      workout => workout.id === activeWorkoutId
    );

    // If the workout exists, update its name and call the updateWorkout function
    if (workoutToUpdate) {
      const updatedWorkout = { ...workoutToUpdate, name: workoutTitle };
      updateWorkout(updatedWorkout);
    }

    // Exit editing mode
    setIsEditing(false);
  };

  const handleCloseTitleChange = e => {
    setIsEditing(false);
  };

  const handleDeleteWorkout = workoutId => {
    deleteWorkout(workoutId);
  };

  const handleDeleteExercise = (workoutId, exerciseId) => {
    deleteExercise(workoutId, exerciseId);
  };

  const toggleWorkoutExpand = () => {
    toggleExpand(activeWorkoutId);
  };

  const handleAddSet = (workoutId, exerciseId) => {
    // Find the active workout and then the exercise
    const activeWorkout = workouts.find(w => w.id === workoutId);
    const exercise = activeWorkout?.exercises.find(e => e.id === exerciseId);

    // Check if the exercise is found before accessing its sets
    if (exercise && exercise.sets) {
      const newSet = {
        weight: '',
        reps: '',
        order: exercise.sets.length + 1
        // Other default properties
      };
      addSet(workoutId, exerciseId, newSet);
    }
  };

  return (
    <div>
      {workouts.map((workout, index) => (
        <div
          className={`workout-container ${theme} ${
            workout.id === activeWorkoutId ? 'active' : ''
          }`}
          key={workout.id}
        >
          <div className='workout-header'>
            <button
              className='workout-container__expand-btn'
              onClick={toggleWorkoutExpand}
            >
              {isExpanded ? (
                <BsChevronCompactUp
                  className={`workout-container__icon ${theme}`}
                  id='expand-icon'
                  size={30}
                />
              ) : (
                <BsChevronCompactDown
                  className={`workout-container__icon ${theme}`}
                  id='collapse-icon'
                  size={30}
                />
              )}
            </button>
            <h2 className='workout-container__title'>
              {isEditing ? (
                <div className='workout-container__title_container'>
                  <button
                    className='workout-container__save-title-btn'
                    onClick={handleSaveTitle}
                  >
                    <IoCheckmarkCircleSharp
                      className={`workout-container__icon ${theme}`}
                      size={20}
                    />
                  </button>
                  <input
                    type='text'
                    className={`workout-container__title-input ${theme}`}
                    value={workoutTitle}
                    onChange={handleEditTitleChange}
                    placeholder='Change Workout Title'
                  />
                  <button
                    className='workout-container__close-title-btn'
                    onClick={handleCloseTitleChange}
                  >
                    <IoCloseCircleSharp
                      className={`workout-container__icon ${theme}`}
                      size={20}
                    />
                  </button>
                </div>
              ) : (
                workout.name
              )}
            </h2>

            <h2 className={`workout-container__title ${theme}`}>
              {workout.name}
            </h2>
            {isExpanded ? (
              <button className='workout-container__edit-title-btn'>
                <TbPencil
                  className={`workout-container__icon ${theme}`}
                  id='edit-icon'
                  size={25}
                  onClick={handleEditTitleChange}
                />
              </button>
            ) : (
              <div className='workout-container__title_container'>
                {/* edit workout title icon*/}
                {/* delete the workout icon */}{' '}
                <button
                  className='workout-container__delete-btn'
                  onClick={handleDeleteWorkout(workout.id)}
                >
                  <GrClose
                    className={`workout-container__icon ${theme}`}
                    id='delete-icon'
                  />
                </button>
              </div>
            )}

            {isExpanded && (
              <div className='workout-container__body'>
                <div className='workout-container__header'>
                  <Button
                    id='toggle-exercises-btn'
                    onClick={() => showExercises(workout.id)}
                    type='button'
                  >
                    {showExerciseList ? 'Hide Exercises' : 'Show Exercise'}
                  </Button>
                </div>
                <div className='workout-container__exercises'>
                  <div className='workout-container__exercises-header-container'>
                    <h4
                      className={`workout-container__exercises_header ${theme}`}
                    >
                      Exercise
                    </h4>
                    <h4
                      className={`workout-container__exercises_header ${theme}`}
                    >
                      Set
                    </h4>
                    <h4
                      className={`workout-container__exercises_header ${theme}`}
                    >
                      Weight
                    </h4>
                    <h4
                      className={`workout-container__exercises_header ${theme}`}
                    >
                      Reps
                    </h4>
                  </div>
                  {workout.exercises && workout.exercises.length > 0 ? (
                    workout.exercises.map((exercise, index) => (
                      <div
                        key={exercise.tempId}
                        className='workout-container__each-exercise'
                      >
                        <div
                          className={`workout-container__drag-order-container ${theme}`}
                        >
                          <span
                            className={`workout-container__exercise-order-number ${theme}`}
                          >
                            {index + 1}
                          </span>{' '}
                          <MdDragHandle
                            size={25}
                            className='workout-container__exercise-drag'
                          />
                        </div>
                        <div className='workout-container__exercise-details'>
                          <h4
                            className={`workout-container__exercises_name ${theme}`}
                          >
                            {exercise.name}
                          </h4>
                          <p
                            className={`workout-container__exercise-muscle ${theme}`}
                          >
                            {exercise.muscle}
                          </p>
                        </div>
                        <div>
                          {exercise.sets && exercise.sets.length > 0 ? (
                            exercise.sets.map(set => (
                              <div
                                className='workout-container__sets-column'
                                key={set.id}
                              >
                                <ExerciseSet
                                  id={set.id}
                                  setDetails={set}
                                  workoutId={workout.id}
                                  exerciseId={exercise.id}
                                />
                              </div>
                            ))
                          ) : (
                            <p className='workout-container__no-exercise-message'>
                              No sets added
                            </p>
                          )}

                          <button
                            onClick={() =>
                              handleAddSet(workout.id, exercise.id)
                            }
                            className='workout-container__add-set-btn'
                          >
                            <MdAddBox size={25} />
                          </button>
                        </div>
                        {/* delete exercise button */}
                        <button
                          className='workout-container__remove-exercise-btn'
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
                    <p className='workout-container__no-exercise-message'>
                      No exercises added
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Workout;
