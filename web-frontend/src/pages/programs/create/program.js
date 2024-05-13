import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProgramContext } from '../../../contexts/programContext';
import Workout from '../../../components/Workout/Workout';
import ProgramForm from '../../../components/Program/ProgramForm';
import NavBar from '../../../components/Nav/Nav';
import Toggle from '../../../components/Inputs/Toggle';
import Button from '../../../components/Inputs/Button';
import './program.css';

const CreateProgram = () => {
  const { state, saveProgram, dispatch } = useContext(ProgramContext);
  const [expandedWorkouts, setExpandedWorkouts] = useState({});

  console.log('Programs:', state.programs);

  console.log('CreateProgram: state:', state);

  console.log('state.workouts:', state.workouts);

  useEffect(() => {
    console.log('Workouts updated:', state);
  }, [state]);

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
    const currentProgramId = Object.keys(state.programs)[0];
    console.log('currentProgramId:', currentProgramId);
    console.log('handleAddWorkout called from CreateProgram.js');
    event.preventDefault();
    dispatch({
      type: 'ADD_WORKOUT',
      payload: { programId: currentProgramId }
    });
  };

  console.log('state.programs:', state.programs);

  const firstProgramId = Object.keys(state.programs)[0];
  console.log('firstProgramId:', firstProgramId);

  if (!state || !state.programs || Object.keys(state.programs).length === 0) {
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
              program={state.programs[Object.keys(state.programs)[0]]}
              isEditing={true}
              isExpanded={expandedWorkouts['program']}
              onToggleExpand={handleToggleProgramForm}
            />
            {state &&
              state.workouts &&
              Object.values(state.workouts).map(workout => (
                <Workout
                  key={workout.id}
                  workoutId={workout.id}
                  isExpanded={expandedWorkouts[workout.id] || false}
                  onToggleExpand={handleExpandWorkout}
                />
              ))}
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
