import { createContext, useReducer } from 'react';
import { actionTypes } from '../actions/actionTypes';
import rootReducer from '../reducers/rootReducer';
import { initialState } from '../reducers/initialState';
import { standardizeWorkout } from '../utils/standardizeWorkout';
import exerciseUtils from '../utils/exercise.js';
import { v4 as uuidv4 } from 'uuid';

export const ProgramContext = createContext();

export const ProgramProvider = ({ children }) => {
  const [state, dispatch] = useReducer(rootReducer, initialState);

  // Program Actions

  const setSelectedProgram = program => {
    console.log('Setting selected program:', program);
    dispatch({
      type: actionTypes.SET_SELECTED_PROGRAM,
      payload: program
    });

    program.workouts.forEach(workout => {
      dispatch({
        type: actionTypes.UPDATE_WORKOUT,
        payload: workout
      });
    });
  };

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
        id: workout.id,
        name: workout.name,
        order: workout.order || 1,
        exercises: workout.exercises.map(exercise => ({
          catalog_exercise_id: exercise.catalog_exercise_id || exercise.id,
          order: exercise.order || 1,
          sets: exercise.sets.map((set, index) => ({
            reps: set.reps,
            weight: set.weight,
            order: set.order || index + 1
          }))
        }))
      }))
    };

    console.log('Saving program with payload:', newProgram);

    dispatch({ type: actionTypes.SAVE_PROGRAM_START });
    try {
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

  const updateProgram = async updatedProgram => {
    dispatch({ type: actionTypes.SAVE_PROGRAM_START });
    try {
      validateProgramData(updatedProgram);

      console.log('Sending updated program to server:', updatedProgram);

      const response = await fetch(
        `http://localhost:9025/api/programs/${updatedProgram.id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedProgram)
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error updating program:', errorText);
        throw new Error('Network response was not ok');
      }
      const savedProgram = await response.json();

      dispatch({
        type: actionTypes.UPDATE_PROGRAM_SUCCESS,
        payload: savedProgram
      });
    } catch (error) {
      console.error('Failed to update program:', error);
      dispatch({
        type: actionTypes.SAVE_PROGRAM_FAILURE,
        payload: error.message
      });
    }
  };

  const updateWorkoutAndProgram = updatedWorkout => {
    dispatch({
      type: actionTypes.UPDATE_WORKOUT,
      payload: updatedWorkout
    });
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

      dispatch({
        type: actionTypes.DELETE_PROGRAM,
        payload: { programId }
      });
    } catch (error) {
      console.error('Failed to delete program:', error);
    }
  };

  // Workout Actions

  const addWorkout = programId => {
    const newWorkout = {
      id: uuidv4(),
      name: 'New Workout',
      programId: programId,
      exercises: [],
      order: Object.keys(state.workouts).length + 1
    };
    console.log('Add Standardized Workout:', newWorkout);
    dispatch({ type: actionTypes.ADD_WORKOUT, payload: newWorkout });
  };

  const updateWorkout = workout => {
    const standardizedWorkout = standardizeWorkout(workout);
    if (!standardizedWorkout) {
      console.error('Invalid workout object:', workout);
      return;
    }
    console.log('Edit Standardized Workout:', standardizedWorkout);
    dispatch({
      type: actionTypes.UPDATE_WORKOUT,
      payload: standardizedWorkout
    });
  };

  const deleteWorkout = workoutId => {
    dispatch({
      type: actionTypes.DELETE_WORKOUT,
      payload: workoutId
    });
  };

  // Exercise Actions

  const addExercise = (workoutId, exercises) => {
    const standardizedExercises = exercises.map(ex => ({
      ...ex,
      tempId: ex.tempId || uuidv4(),
      catalog_exercise_id: ex.catalog_exercise_id || ex.id,
      sets: ex.sets || [],
      selected: true
    }));

    dispatch({
      type: actionTypes.ADD_EXERCISE,
      payload: { workoutId, exercises: standardizedExercises }
    });
  };

  const removeExercise = (workoutId, exerciseId) => {
    console.log('Removing exercise:', exerciseId, 'from workout:', workoutId);
    dispatch({
      type: actionTypes.REMOVE_EXERCISE,
      payload: { workoutId, exerciseId }
    });
  };

  const toggleExerciseSelection = (exerciseId, exerciseData) => {
    if (!state.activeWorkout) {
      console.error('No active workout selected');
      return;
    }

    const workout = state.workouts[state.activeWorkout];
    const exerciseExists = workout.exercises.some(ex => ex.id === exerciseId);

    if (exerciseExists) {
      // If the exercise exists, remove it
      dispatch({
        type: actionTypes.REMOVE_EXERCISE,
        payload: { workoutId: state.activeWorkout, exerciseId }
      });
    } else {
      // If the exercise doesn't exist, add it
      dispatch({
        type: actionTypes.TOGGLE_EXERCISE_SELECTION,
        payload: {
          exerciseIdForToggle: exerciseId,
          exerciseData: exerciseData
        }
      });
    }
  };

  // Set Actions

  const addSet = (workoutId, exerciseId, weight = 10, reps = 10) => {
    console.log('Adding set. Current workouts state:', state.workouts);
    console.log(
      'Adding set for workoutId:',
      workoutId,
      'exerciseId:',
      exerciseId
    );
    const workout = state.workouts[workoutId];

    if (!workout) {
      console.error('Workout not found:', workoutId);
      console.log('Available workout IDs:', Object.keys(state.workouts));
      return;
    }

    const exercise = workout.exercises.find(
      ex => exerciseUtils.getExerciseId(ex) === exerciseId
    );
    if (!exercise) {
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
    dispatch({
      type: actionTypes.UPDATE_SET,
      payload: { workoutId, exerciseId, updatedSet }
    });
  };

  const removeSet = (workoutId, exerciseId, setId) => {
    const workout = state.workouts[workoutId];
    if (!workout) {
      console.error('Workout not found:', workoutId);
      return;
    }

    const exercise = workout.exercises.find(
      ex => exerciseUtils.getExerciseId(ex) === exerciseId
    );
    if (!exercise) {
      console.error(
        'Exercise not found:',
        exerciseId,
        'in workout:',
        workoutId
      );
      return;
    }

    const updatedSets = exercise.sets.filter(set => set.id !== setId);
    if (updatedSets.length === exercise.sets.length) {
      console.error('Set not found:', setId, 'in exercise:', exerciseId);
      return;
    }

    const updatedExercises = workout.exercises.map(ex =>
      exerciseUtils.getExerciseId(ex) === exerciseId
        ? { ...ex, sets: updatedSets }
        : ex
    );

    dispatch({
      type: actionTypes.UPDATE_WORKOUT,
      payload: {
        ...workout,
        exercises: updatedExercises
      }
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
        setSelectedProgram,
        addProgram,
        updateProgram,
        updateWorkoutAndProgram,
        deleteProgram,
        addWorkout,
        updateWorkout,
        deleteWorkout,
        setActiveWorkout,
        addExercise,
        toggleExerciseSelection,
        removeExercise,
        addSet,
        updateSet,
        removeSet,
        saveProgram,
        clearState
      }}
    >
      {children}
    </ProgramContext.Provider>
  );
};
