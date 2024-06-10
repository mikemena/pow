import { createContext, useReducer, useEffect } from 'react';
import { actionTypes } from '../actions/actionTypes';
import rootReducer from '../reducers/rootReducer';
// import { exerciseReducer } from '../reducers/exerciseReducer';
import { initialState } from '../reducers/initialState';

export const ProgramContext = createContext();

console.log('initialState:', initialState);

export const ProgramProvider = ({ children }) => {
  const [state, dispatch] = useReducer(rootReducer, initialState);

  console.log('Initial state in Context:', state);

  const setActiveWorkout = workoutId => {
    console.log('Setting active workout:', workoutId); // Debug log to check the workout ID
    if (!workoutId) {
      console.error('Attempted to set active workout without a valid ID');
      return; // Optionally return to avoid dispatching undefined ID
    }
    dispatch({
      type: actionTypes.SET_ACTIVE_WORKOUT,
      payload: workoutId
    });
  };

  useEffect(() => {
    console.log('Updated state in context:', state);
  }, [state]);

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

  const deleteExercise = (workoutId, exerciseId) => ({
    type: actionTypes.DELETE_EXERCISE,
    payload: { workoutId, exerciseId }
  });

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

  console.log('ProgramProvider: state:', state);

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
        saveProgram
      }}
    >
      {children}
    </ProgramContext.Provider>
  );
};
