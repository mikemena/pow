import { createContext, useReducer } from 'react';
import { actionTypes } from '../actions/actionTypes';
import rootReducer from '../reducers/rootReducer';
import { currentProgram } from '../reducers/initialState.js';
import { standardizeWorkout } from '../utils/standardizeWorkout.js';
import { v4 as uuidv4 } from 'uuid';

export const ProgramContext = createContext();

export const ProgramProvider = ({ children }) => {
  const [state, dispatch] = useReducer(rootReducer, currentProgram);

  // Program Actions

  // Clear program state
  const clearProgram = () => {
    dispatch({
      type: actionTypes.CLEAR_PROGRAM,
      payload: currentProgram
    });
  };

  // Initialize state for creating a new program
  const initializeNewProgramState = () => {
    const newProgram = {
      ...currentProgram.program,
      id: uuidv4(), // Generate a new unique ID for the new program
      name: '', // Reset other fields as needed
      program_duration: 0,
      duration_unit: '',
      days_per_week: 0,
      main_goal: ''
    };

    dispatch({
      type: actionTypes.INITIALIZE_NEW_PROGRAM_STATE,
      payload: {
        program: newProgram,
        workouts: [],
        activeWorkout: null
      }
    });
  };

  // Initialize state for editing an existing program
  const initializeEditProgramState = (program, workouts) => {
    dispatch({
      type: actionTypes.INITIALIZE_EDIT_PROGRAM_STATE,
      payload: {
        program,
        workouts,
        activeWorkout: workouts.length > 0 ? workouts[0].id : null
      }
    });
  };

  // Save program to backend
  const saveProgram = async () => {
    const newProgram = {
      ...state.program,
      workouts: state.workout.workouts.map(workout => ({
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

    dispatch({ type: actionTypes.SAVE_PROGRAM_START });

    try {
      validateProgramData(newProgram); // Validate data before sending
      const response = await fetch('http://localhost:9025/api/programs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProgram)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error saving program:', errorText);
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

  // Update program in backend
  const updateProgram = async updatedProgram => {
    dispatch({ type: actionTypes.SAVE_PROGRAM_START });

    try {
      validateProgramData(updatedProgram);
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

  // Validate program data structure
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

  // Add new program details
  const addProgram = details => {
    dispatch({
      type: actionTypes.ADD_PROGRAM,
      payload: details
    });
  };

  // Delete a program
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

  // Set active workout by ID
  const setActiveWorkout = workoutId => {
    if (!workoutId) {
      console.error('Attempted to set active workout without a valid ID');
      return;
    }

    dispatch({
      type: actionTypes.SET_ACTIVE_WORKOUT,
      payload: { activeWorkout: workoutId }
    });
  };

  // Add a new workout to the program
  const addWorkout = programId => {
    const workoutData = {
      programId: programId,
      exercises: []
    };

    const newWorkout = standardizeWorkout(
      workoutData,
      state.workout.workouts.length
    );

    console.log('Adding workout in context:', newWorkout);
    dispatch({
      type: actionTypes.ADD_WORKOUT,
      payload: newWorkout
    });
  };

  // Update existing workout
  const updateWorkout = updatedWorkout => {
    dispatch({
      type: actionTypes.UPDATE_WORKOUT,
      payload: { updatedWorkout }
    });
  };

  // Delete a workout by ID
  const deleteWorkout = workoutId => {
    if (!workoutId) {
      console.error('Attempted to delete workout without a valid ID');
      return;
    }

    dispatch({
      type: actionTypes.DELETE_WORKOUT,
      payload: { workoutId }
    });
  };

  // Exercise Actions

  // Add exercises to a workout
  const addExercise = (workoutId, exercises) => {
    const standardizedExercises = exercises.map(ex => ({
      ...ex,
      id: uuidv4(),
      catalog_exercise_id: ex.catalog_exercise_id || ex.id,
      sets: ex.sets || [],
      selected: true
    }));

    dispatch({
      type: actionTypes.ADD_EXERCISE,
      payload: { workoutId, exercises: standardizedExercises }
    });
  };

  // Remove an exercise from a workout
  const removeExercise = (workoutId, exerciseId) => {
    dispatch({
      type: actionTypes.REMOVE_EXERCISE,
      payload: { workoutId, exerciseId }
    });
  };

  // Toggle exercise selection within a workout
  const toggleExerciseSelection = (exerciseId, exerciseData) => {
    if (!state.workout.activeWorkout) {
      console.error('No active workout selected');
      return;
    }

    const workout = state.workout.workouts.find(
      w => w.id === state.workout.activeWorkout
    );
    const exerciseExists = workout.exercises.some(ex => ex.id === exerciseId);

    if (exerciseExists) {
      // If the exercise exists, remove it
      dispatch({
        type: actionTypes.REMOVE_EXERCISE,
        payload: { workoutId: state.workout.activeWorkout, exerciseId }
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

  // Add a new set to an exercise
  const addSet = (workoutId, exerciseId) => {
    dispatch({
      type: actionTypes.ADD_SET,
      payload: { workoutId, exerciseId }
    });
  };

  // Update an existing set within an exercise
  const updateSet = (workoutId, exerciseId, updatedSet) => {
    dispatch({
      type: actionTypes.UPDATE_SET,
      payload: { workoutId, exerciseId, updatedSet }
    });
  };

  // Remove a set from an exercise
  const removeSet = (workoutId, exerciseId, setId) => {
    dispatch({
      type: actionTypes.REMOVE_SET,
      payload: { workoutId, exerciseId, setId }
    });
  };

  return (
    <ProgramContext.Provider
      value={{
        state,
        dispatch,
        activeWorkout: state.workout.activeWorkout,
        initializeNewProgramState,
        initializeEditProgramState,
        addProgram,
        updateProgram,
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
        clearProgram
      }}
    >
      {children}
    </ProgramContext.Provider>
  );
};
