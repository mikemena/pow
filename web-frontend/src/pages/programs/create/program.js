import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProgramContext } from '../../../contexts/programContext';
import { WorkoutProvider } from '../../../contexts/workoutContext';
import Workout from '../../../components/Workout/Workout';
import ProgramForm from '../../../components/Program/ProgramForm';
import ProgramButtonContainer from '../../../components/ProgramButtonContainer/ProgramButtonContainer';
import NavBar from '../../../components/Nav/Nav';
import ExerciseList from '../../../components/ExerciseList/ExerciseList';
import Toggle from '../../../components/Inputs/Toggle';
import './program.css';

const CreateProgram = () => {
  const { program, saveProgram } = useContext(ProgramContext);

  const [showExerciseList, setShowExerciseList] = useState(false);
  const [activeWorkout, setActiveWorkout] = useState(null);
  const [expandedWorkouts, setExpandedWorkouts] = useState({});
  const [renderKey, setRenderKey] = useState(0); // Add a render key

  const navigate = useNavigate();

  const handleShowExercise = workoutId => {
    if (workoutId === activeWorkout && showExerciseList) {
      setShowExerciseList(false);
      setActiveWorkout(null);
    } else {
      setShowExerciseList(true);
      setActiveWorkout(workoutId);
    }
  };

  const handleSaveProgram = async () => {
    try {
      await saveProgram();
      navigate('/programs');
    } catch (error) {
      console.error('Failed to save the program:', error);
    }
  };

  const handleExpandWorkout = workoutId => {
    // Collapse all other items when one is expanded
    setExpandedWorkouts(prevState => ({
      ...Object.keys(prevState).reduce((acc, key) => {
        acc[key] = false; // collapse all
        return acc;
      }, {}),
      [workoutId]: !prevState[workoutId] // toggle the clicked one
    }));
  };

  const handleToggleProgramForm = () => {
    setExpandedWorkouts(prevState => ({
      ...Object.keys(prevState).reduce((acc, key) => {
        acc[key] = false; // collapse all workouts
        return acc;
      }, {}),
      program: !prevState.program // toggle the program form
    }));
  };

  useEffect(() => {
    if (program.workouts.length > 0) {
      const lastWorkout = program.workouts[program.workouts.length - 1];
      setActiveWorkout(lastWorkout.id);
    }
  }, [program.workouts]);

  useEffect(() => {
    console.log('Workouts updated in main component:', program.workouts);
    setRenderKey(prevKey => prevKey + 1); // Increment the render key
  }, [program.workouts]);

  return (
    <div>
      <NavBar isEditing='true' />
      <div className='create-prog-page'>
        <div className='create-prog-page__toggle-container'>
          <Toggle />
        </div>
        <div className='create-prog-page__container'>
          <div className='create-prog-page__left-container'>
            <ProgramForm
              program={program}
              isEditing={true}
              isExpanded={expandedWorkouts['program'] || true}
              onToggleExpand={() => handleToggleProgramForm('program')}
            />

            <WorkoutProvider key={renderKey}>
              {' '}
              {/* Pass the render key here */}
              {program.workouts.map(workout => (
                <Workout
                  key={workout.id}
                  workoutId={workout.id}
                  isExpanded={expandedWorkouts[workout.id] || false}
                  onToggleExpand={handleExpandWorkout}
                />
              ))}
            </WorkoutProvider>
          </div>
          <div className='create-prog-page__right-container'>
            <h1 className='create-prog-page__exercise-container-title'>
              {activeWorkout
                ? `Adding exercises for ${
                    program.workouts.find(
                      workout => workout.id === activeWorkout
                    )?.name
                  }`
                : ''}
            </h1>
            {showExerciseList && (
              <ExerciseList
                activeWorkout={activeWorkout}
                selectedExercises={
                  program.workouts.find(workout => workout.id === activeWorkout)
                    ?.exercises || []
                }
              />
            )}
          </div>
        </div>
        <div className='create-prog-page__button-container'>
          <ProgramButtonContainer />
        </div>
      </div>
    </div>
  );
};

export default CreateProgram;
