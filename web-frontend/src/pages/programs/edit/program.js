import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProgramContext } from '../../../contexts/programContext';
import Button from '../../../components/Inputs/Button';
import Workout from '../../../components/Workout/Workout';
import ProgramForm from '../../../components/Program/ProgramForm';
import NavBar from '../../../components/Nav/Nav';
import Toggle from '../../../components/Inputs/Toggle';

import './program.css';

const EditProgram = () => {
  const { state, updateProgram, dispatch, setActiveWorkout, clearState } =
    useContext(ProgramContext);
  const [expandedWorkouts, setExpandedWorkouts] = useState({});
  const navigate = useNavigate();

  const program = state.programs.selectedProgram;
  console.log('Entire state in EditProgram:', program);

  if (!program) {
    return <div>Loading...</div>;
  }

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
    event.preventDefault();
    if (program) {
      dispatch({
        type: 'ADD_WORKOUT',
        payload: { programId: program.id }
      });
    }
  };

  const handleUpdateProgram = async () => {
    try {
      const updatedProgram = {
        ...program,
        workouts: state.workouts
          ? Object.values(state.workouts)
          : program.workouts
      };
      console.log('Program before update (program):', program);
      console.log('Workouts before update (state.workouts):', state.workouts);
      console.log('Updated program:', updatedProgram);
      await updateProgram(program.id);
      navigate('/programs');
    } catch (error) {
      console.error('Failed to save the program:', error);
    }
  };

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
              isNewProgram={false}
              isExpanded={expandedWorkouts['program']}
              onToggleExpand={handleToggleProgramForm}
            />
            {program && program.workouts && program.workouts.length > 0 ? (
              program.workouts.map(workout => {
                if (!workout || !workout.id) {
                  console.error('Invalid workout object:', workout); // Log invalid workout object
                  return null;
                }
                return (
                  <Workout
                    key={workout.id}
                    isEditing={true}
                    isNewProgram={false}
                    workout={workout}
                    isExpanded={expandedWorkouts[workout.id] || false}
                    onToggleExpand={() => handleExpandWorkout(workout.id)}
                  />
                );
              })
            ) : (
              <div>No workouts available</div>
            )}
          </div>
        </div>
        <div className='create-prog-page__button-container'>
          <Button type='button' onClick={handleAddWorkout}>
            Add Workout
          </Button>
          <Button type='submit' onClick={handleUpdateProgram}>
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

export default EditProgram;
