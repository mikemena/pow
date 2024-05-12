import { createContext, useReducer, useState } from 'react';
import { actionTypes } from '../actions/actionTypes';
import rootReducer from '../reducers/rootReducer';
import { initialState } from '../reducers/initialState';

export const ProgramContext = createContext();

export const ProgramProvider = ({ children }) => {
  const [programState, dispatch] = useReducer(rootReducer, initialState);
  const [activeWorkout, setActiveWorkout] = useState(null);

  console.log('ProgramProvider: Initial State:', initialState);
  console.log('ProgramProvider: Current State:', programState);

  // Function to update the active workout
  const updateActiveWorkout = workout => {
    setActiveWorkout(workout);
  };

  //Save program to the database
  const saveProgram = async newProgram => {
    dispatch({ type: actionTypes.SAVE_PROGRAM_START });
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
      dispatch({
        type: actionTypes.SAVE_PROGRAM_SUCCESS,
        payload: savedProgram
      });
    } catch (error) {
      dispatch({
        type: actionTypes.SAVE_PROGRAM_FAILURE,
        payload: error.message
      });
    }
  };

  // For updating basic program information like name, duration, etc.

  const updateProgramDetails = details => {
    dispatch({
      type: actionTypes.UPDATE_PROGRAM_DETAILS,
      payload: details
    });
  };

  const addWorkout = workout => {
    console.log('addWorkout called from context');
    dispatch({
      type: actionTypes.ADD_WORKOUT,
      payload: workout
    });
  };

  const updateWorkout = workout => {
    dispatch({
      type: actionTypes.UPDATE_WORKOUT,
      payload: workout
    });
  };

  const deleteWorkout = workoutId => {
    dispatch({
      type: actionTypes.DELETE_WORKOUT,
      payload: workoutId
    });
  };

  const addExercise = (workoutId, exercises) => {
    dispatch({
      type: actionTypes.ADD_EXERCISE,
      payload: { workoutId, exercises }
    });
  };
  // Function to update an exercise

  const updateExercise = (workoutId, updatedExercise) => {
    dispatch({
      type: actionTypes.UPDATE_EXERCISE,
      payload: { workoutId, updatedExercise }
    });
  };

  // Function to delete exercise from  a specific workout

  const deleteExercise = (workoutId, exerciseId) => {
    dispatch({
      type: actionTypes.DELETE_EXERCISE,
      payload: { workoutId, exerciseId }
    });
  };

  // Function to add sets to a specific exercise

  const addSet = (workoutId, exerciseId, newSet) => {
    dispatch({
      type: actionTypes.ADD_SET,
      payload: { workoutId, exerciseId, newSet }
    });
  };

  const updateSet = (workoutId, exerciseId, updatedSet) => {
    dispatch({
      type: actionTypes.UPDATE_SET,
      payload: { workoutId, exerciseId, updatedSet }
    });
  };

  const deleteSet = (workoutId, exerciseId, setId) => {
    dispatch({
      type: actionTypes.DELETE_SET,
      payload: { workoutId, exerciseId, setId }
    });
  };

  console.log('ProgramProvider: programState:', programState);

  return (
    <ProgramContext.Provider
      value={{
        programState,
        dispatch,
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
