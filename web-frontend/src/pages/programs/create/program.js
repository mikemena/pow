import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProgramContext } from '../../../contexts/programContext';
import { WorkoutProvider } from '../../../contexts/workoutContext';
import Workout from '../../../components/Workout/Workout';
import ProgramForm from '../../../components/Program/ProgramForm';
import NavBar from '../../../components/Nav/Nav';
import Toggle from '../../../components/Inputs/Toggle';
import Button from '../../../components/Inputs/Button';
import './program.css';

const CreateProgram = () => {
  const { program, saveProgram, addWorkout } = useContext(ProgramContext);
  const [activeWorkout, setActiveWorkout] = useState(null);
  const [expandedWorkouts, setExpandedWorkouts] = useState({});
  const [renderKey, setRenderKey] = useState(0); // Add a render key

  const navigate = useNavigate();

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

  const handleCancel = () => {
    // Redirect to the create workout page
    navigate('/');
  };

  const handleAddWorkout = event => {
    // console.log('handleAddWorkout called');
    event.preventDefault();
    addWorkout({});
  };

  useEffect(() => {
    if (program.workouts.length > 0) {
      const lastWorkout = program.workouts[program.workouts.length - 1];
      setActiveWorkout(lastWorkout.id);
    }
  }, [program.workouts]);

  useEffect(() => {
    setRenderKey(prevKey => prevKey + 1);
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
              isExpanded={expandedWorkouts['program']}
              onToggleExpand={handleToggleProgramForm}
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
          </div>
        </div>
        <div className='create-prog-page__button-container'>
          <Button type='button' onClick={handleAddWorkout}>
            Add Workout
          </Button>
          <Button type='submit' onClick={handleSaveProgram}>
            Save
          </Button>
          <Button type='button' onClick={handleCancel}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateProgram;
