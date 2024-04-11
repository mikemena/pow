import React, {
  useContext,
  useState,
  useEffect,
  useRef,
  createRef
} from 'react';

import gsap from 'gsap';

import {
  TbLayoutNavbarExpandFilled,
  TbLayoutBottombarExpandFilled,
  TbPencil
} from 'react-icons/tb';
import { IoCloseCircleSharp, IoCheckmarkCircleSharp } from 'react-icons/io5';
import { MdDelete, MdDragHandle, MdAddBox } from 'react-icons/md';
import Button from '../Inputs/Button';
import { WorkoutContainerContext } from '../../contexts/workoutContainerContext';
import { ProgramContext } from '../../contexts/programContext';
import { useTheme } from '../../contexts/themeContext';
import ExerciseSet from '../ExerciseSet/ExerciseSet';
import './WorkoutContainer.css';

const WorkoutSlider = ({
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
    updateWorkout({ ...activeWorkoutId, name: workoutTitle });
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
  // References to our DOM elements
  const sliderRef = useRef(null);

  // Initialize workoutRefs only if workouts is not undefined
  const workoutRefs = useRef([]);
  useEffect(() => {
    workoutRefs.current = workoutRefs.current.slice(0, workouts.length);
  }, [workouts]);

  useEffect(() => {
    // Find the index of the active workout
    const activeIndex = workouts.findIndex(
      workout => workout.id === activeWorkoutId
    );

    // GSAP initial setup to position all workouts side by side
    gsap.set(workoutRefs.current, {
      xPercent: idx => (idx - activeIndex) * 100
    });

    // Then, when activeWorkoutId changes, animate to the new active workout
    gsap.to(workoutRefs.current, {
      xPercent: idx => (idx - activeIndex) * 100,
      ease: 'none',
      duration: 0.5 // Adjust duration to your liking
    });
  }, [activeWorkoutId, workouts]);

  const slideToWorkout = index => {
    // You need to calculate the ID of the workout based on the index
    const workoutIdAtIndex = workouts[index].id;
    onWorkoutChange(workoutIdAtIndex); // This should set the activeWorkoutId in your state
  };

  const navigateToWorkout = direction => {
    // Calculate the new index here and then call slideToWorkout
    const activeIndex = workouts.findIndex(
      workout => workout.id === activeWorkoutId
    );
    const nextIndex =
      (activeIndex + direction + workouts.length) % workouts.length;
    slideToWorkout(nextIndex);
  };

  return (
    <>
      <div className='workout-slider' ref={sliderRef}>
        {workouts.map((workout, index) => (
          <div
            className='workout-container'
            ref={workoutRefs.current[index]}
            key={workout.id}
          >
            <>
              <div>
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
                      <h2 className={`workout-container__title ${theme}`}>
                        {workout.name}
                      </h2>
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
                    disabled={program.workouts.length <= 1}
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
          </div>
        ))}
      </div>
      <div className='controls'>
        <button onClick={() => navigateToWorkout(-1)}>Prev</button>
        <button onClick={() => navigateToWorkout(1)}>Next</button>
      </div>
    </>
  );
};

export default WorkoutSlider;
