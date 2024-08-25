import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProgramContext } from '../../../contexts/programContext';
import Workout from '../../../components/Workout/Workout';
import ProgramForm from '../../../components/Program/ProgramForm';
import NavBar from '../../../components/Nav/Nav';
import Toggle from '../../../components/Inputs/Toggle';
import Button from '../../../components/Inputs/Button';
import './program.css';

const CreateProgram = () => {
  const { state, saveProgram, addWorkout, setActiveWorkout, clearState } =
    useContext(ProgramContext);
  const program = state.program;
  console.log('program', program);
  const { workouts, activeWorkout } = state.workout;
  console.log('workouts', workouts);
  console.log('activeWorkout', activeWorkout);
  const [expandedWorkouts, setExpandedWorkouts] = useState({});

  const navigate = useNavigate();

  const handleSaveProgram = async () => {
    try {
      await saveProgram(state.program);
      navigate('/programs');
    } catch (error) {
      console.error('Failed to save the program:', error);
    }
  };

  const handleExpandWorkout = workoutId => {
    const isCurrentlyExpanded = expandedWorkouts[workoutId];

    setExpandedWorkouts(prevState => ({
      ...Object.keys(prevState).reduce((acc, key) => {
        acc[key] = false; // collapse all
        return acc;
      }, {}),
      [workoutId]: !isCurrentlyExpanded
    }));

    if (!isCurrentlyExpanded) {
      setActiveWorkout(workoutId);
    } else {
      setActiveWorkout(null);
    }
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
    clearState();
    navigate('/');
  };

  const handleAddWorkout = event => {
    console.log('Adding workout');
    event.preventDefault();
    addWorkout(program.id);
  };

  if (!state || !state.program) {
    return <div>Loading or no programs available...</div>;
  }

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
              program={state.program}
              isEditing={true}
              isNewProgram={true}
              isExpanded={expandedWorkouts['program']}
              onToggleExpand={handleToggleProgramForm}
            />
            {workouts && workouts.length > 0 ? (
              workouts.map(workout => (
                <Workout
                  key={workout.id}
                  workout={workout}
                  isNewProgram={true}
                  isExpanded={expandedWorkouts[workout.id] || false}
                  onToggleExpand={() => handleExpandWorkout(workout.id)}
                />
              ))
            ) : (
              <div>No workouts available</div>
            )}
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
