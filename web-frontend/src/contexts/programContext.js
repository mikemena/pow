import { createContext, useReducer } from 'react';
import { actionTypes } from '../actions/actionTypes';
import rootReducer from '../reducers/rootReducer';
import { initialState } from '../reducers/initialState';

export const ProgramContext = createContext();

export const ProgramProvider = ({ children }) => {
  const [state, dispatch] = useReducer(rootReducer, initialState);

  const setActiveWorkout = workoutId => {
    if (!workoutId) {
      console.error('Attempted to set active workout without a valid ID');
      return; // Optionally return to avoid dispatching undefined ID
    }
    dispatch({
      type: actionTypes.SET_ACTIVE_WORKOUT,
      payload: workoutId
    });
  };

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

  const deleteExercise = (workoutId, exerciseId) => {
    dispatch({
      type: actionTypes.DELETE_EXERCISE,
      payload: { workoutId, exerciseId }
    });
  };

  const addSet = (workoutId, exerciseId, weight = 0, reps = 0) => {
    dispatch({
      type: 'ADD_SET',
      payload: { workoutId, exerciseId, weight, reps }
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

  const clearState = () => {
    dispatch({ type: actionTypes.CLEAR_STATE });
  };

  return (
    <ProgramContext.Provider
      value={{
        state,
        dispatch,
        activeWorkout: state.activeWorkout,
        updateProgramDetails,
        addWorkout,
        updateWorkout,
        deleteWorkout,
        setActiveWorkout,
        addExercise,
        deleteExercise,
        addSet,
        updateSet,
        deleteSet,
        saveProgram,
        clearState
      }}
    >
      {children}
    </ProgramContext.Provider>
  );
};
