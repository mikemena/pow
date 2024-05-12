import { createContext, useReducer, useState } from 'react';
import { actionTypes } from '../actions/actionTypes';
import rootReducer from '../reducers/rootReducer';
import { initialState } from '../reducers/initialState';

export const ProgramContext = createContext();

export const ProgramProvider = ({ children }) => {
  const [programState, programDispatch] = useReducer(rootReducer, initialState);
  const [activeWorkout, setActiveWorkout] = useState(null);

  console.log('ProgramProvider: Initial State:', initialState);
  console.log('ProgramProvider: Current State:', programState);

  // Function to update the active workout
  const updateActiveWorkout = workout => {
    setActiveWorkout(workout);
  };

  //Save program to the database
  const saveProgram = async newProgram => {
    programDispatch({ type: actionTypes.SAVE_PROGRAM_START });
    try {
      const response = await fetch('http://localhost:9025/api/programs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProgram)
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const savedProgram = await response.json();
      programDispatch({
        type: actionTypes.SAVE_PROGRAM_SUCCESS,
        payload: savedProgram
      });
    } catch (error) {
      programDispatch({
        type: actionTypes.SAVE_PROGRAM_FAILURE,
        payload: error.message
      });
    }
  };

  // For updating basic program information like name, duration, etc.

  const updateProgramDetails = details => {
    programDispatch({
      type: actionTypes.UPDATE_PROGRAM_DETAILS,
      payload: details
    });
  };

  const addWorkout = workout => {
    console.log('addWorkout called from context');
    programDispatch({
      type: actionTypes.ADD_WORKOUT,
      payload: workout
    });
  };

  const updateWorkout = workout => {
    programDispatch({
      type: actionTypes.UPDATE_WORKOUT,
      payload: workout
    });
  };

  const deleteWorkout = workoutId => {
    programDispatch({
      type: actionTypes.DELETE_WORKOUT,
      payload: workoutId
    });
  };

  const addExercise = (workoutId, exercises) => {
    programDispatch({
      type: actionTypes.ADD_EXERCISE,
      payload: { workoutId, exercises }
    });
  };
  // Function to update an exercise

  const updateExercise = (workoutId, updatedExercise) => {
    programDispatch({
      type: actionTypes.UPDATE_EXERCISE,
      payload: { workoutId, updatedExercise }
    });
  };

  // Function to delete exercise from  a specific workout

  const deleteExercise = (workoutId, exerciseId) => {
    programDispatch({
      type: actionTypes.DELETE_EXERCISE,
      payload: { workoutId, exerciseId }
    });
  };

  // Function to add sets to a specific exercise

  const addSet = (workoutId, exerciseId, newSet) => {
    programDispatch({
      type: actionTypes.ADD_SET,
      payload: { workoutId, exerciseId, newSet }
    });
  };

  const updateSet = (workoutId, exerciseId, updatedSet) => {
    programDispatch({
      type: actionTypes.UPDATE_SET,
      payload: { workoutId, exerciseId, updatedSet }
    });
  };

  const deleteSet = (workoutId, exerciseId, setId) => {
    programDispatch({
      type: actionTypes.DELETE_SET,
      payload: { workoutId, exerciseId, setId }
    });
  };

  console.log('ProgramProvider: programState:', programState);

  return (
    <ProgramContext.Provider
      value={{
        programState,
        programDispatch,
        updateProgramDetails,
        addWorkout,
        updateWorkout,
        deleteWorkout,
        updateActiveWorkout,
        addExercise,
        updateExercise,
        deleteExercise,
        addSet,
        updateSet,
        deleteSet,
        saveProgram
      }}
    >
      {children}
    </ProgramContext.Provider>
  );
};
