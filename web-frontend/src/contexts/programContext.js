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

  const saveProgram = async () => {
    const programId = Object.keys(state.programs)[0];
    const newProgram = {
      ...state.programs[programId],
      workouts: Object.values(state.workouts).map(workout => ({
        ...workout,
        exercises: (state.exercises[workout.id] || []).map(exercise => ({
          ...exercise,
          sets: state.sets[exercise.id] || []
        })),
        order: workout.order || 1
      }))
    };

    dispatch({ type: actionTypes.SAVE_PROGRAM_START });
    try {
      // console.log('Saving program:', newProgram);
      validateProgramData(newProgram); // Validate data before sending
      const response = await fetch('http://localhost:9025/api/programs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProgram)
      });

      if (!response.ok) {
        const errorText = await response.text(); // Get the response text
        console.error('Error saving program:', errorText); // Log the error text
        throw new Error('Network response was not ok');
      }
      const savedProgram = await response.json();
      dispatch({
        type: actionTypes.SAVE_PROGRAM_SUCCESS,
        payload: savedProgram
      });
    } catch (error) {
      console.error('Failed to save program:', error);
      dispatch({
        type: actionTypes.SAVE_PROGRAM_FAILURE,
        payload: error.message
      });
    }
  };

  const validateProgramData = programData => {
    if (!programData.workouts || !Array.isArray(programData.workouts)) {
      throw new Error('Workouts should be an array.');
    }
    programData.workouts.forEach(workout => {
      if (!workout.exercises || !Array.isArray(workout.exercises)) {
        throw new Error('Exercises should be an array.');
      }
      workout.exercises.forEach(exercise => {
        if (!exercise.sets || !Array.isArray(exercise.sets)) {
          throw new Error('Sets should be an array.');
        }
      });
    });
  };

  const addProgram = details => {
    dispatch({
      type: actionTypes.ADD_PROGRAM,
      payload: details
    });
  };

  const deleteProgram = async programId => {
    try {
      // console.log('Deleting program:', programId);

      const response = await fetch(
        `http://localhost:9025/api/programs/${programId}`,
        {
          method: 'DELETE'
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error deleting program:', errorText);
        throw new Error('Failed to delete program');
      }

      // console.log('Dispatching DELETE_PROGRAM for program ID:', programId);
      dispatch({
        type: actionTypes.DELETE_PROGRAM,
        payload: { programId }
      });
    } catch (error) {
      console.error('Failed to delete program:', error);
    }
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
    // console.log(
    //   'Adding exercise with workoutId:',
    //   workoutId,
    //   'and exercises:',
    //   exercises
    // );
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

  const addSet = (workoutId, exerciseId, weight = 10, reps = 10) => {
    console.log('Adding set for workout:', workoutId, 'exercise:', exerciseId);

    // Check if the workout exists
    if (!state.workouts[workoutId]) {
      console.error('Workout not found:', workoutId);
      return;
    }

    // Check if the exercise exists
    const exerciseExists = state.exercises[workoutId]?.some(
      ex => ex.id === exerciseId
    );
    if (!exerciseExists) {
      console.error(
        'Exercise not found:',
        exerciseId,
        'in workout:',
        workoutId
      );
      return;
    }

    dispatch({
      type: actionTypes.ADD_SET,
      payload: { workoutId, exerciseId, weight, reps }
    });
  };

  const updateSet = (workoutId, exerciseId, updatedSet) => {
    // console.log('Dispatching UPDATE_SET:', {
    //   workoutId,
    //   exerciseId,
    //   updatedSet
    // });
    dispatch({
      type: actionTypes.UPDATE_SET,
      payload: { workoutId, exerciseId, updatedSet }
    });
  };

  const deleteSet = (workoutId, exerciseId, setId) => {
    const exercise = state.exercises[workoutId].find(
      ex => ex.id === exerciseId
    );
    const initialState = exercise?.sets || [];
    const additionalSets = state.sets[exerciseId] || [];
    const combinedSets = [...initialState, ...additionalSets];
    // console.log('combinedSets:', combinedSets);

    // const exerciseSets = state.sets[exerciseId];
    // console.log('exerciseSets in deleteSet:', exerciseSets);
    // console.log('combinedSets length:', combinedSets.length);

    if (combinedSets.length > 1) {
      // console.log('Dispatching DELETE_SET:', { workoutId, exerciseId, setId });
      dispatch({
        type: actionTypes.DELETE_SET,
        payload: { workoutId, exerciseId, setId }
      });
    } else {
      console.log('Cannot delete the only remaining set.');
    }
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
        addProgram,
        deleteProgram,
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
