import { createContext, useReducer } from 'react';
import { actionTypes } from '../actions/actionTypes';
import rootReducer from '../reducers/rootReducer';

export const ProgramContext = createContext();

export const ProgramProvider = ({ children }) => {
  // Define the initial state structure matching the keys used in your combined reducers
  const initialState = {
    program: { workouts: [] }, // Default structure
    saveProgram: () => {},
    addWorkout: () => {}
  };

  const [state, dispatch] = useReducer(rootReducer, initialState);

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

  console.log('ProgramProvider state:', state);

  return (
    <ProgramContext.Provider
      value={{
        state,
        dispatch,
        updateProgramDetails,
        addWorkout,
        updateWorkout,
        deleteWorkout,
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
