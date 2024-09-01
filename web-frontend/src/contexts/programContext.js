import { createContext, useReducer, useCallback } from 'react';
import { actionTypes } from '../actions/actionTypes';
import { programReducer } from '../reducers/programReducer.js';
import { currentProgram } from '../reducers/initialState.js';
import { v4 as uuidv4 } from 'uuid';

export const ProgramContext = createContext();

export const ProgramProvider = ({ children }) => {
  const [state, dispatch] = useReducer(programReducer, currentProgram);

  // Program Actions

  // Clear program state
  const clearProgram = () => {
    dispatch({
      type: actionTypes.CLEAR_PROGRAM,
      payload: currentProgram
    });
  };

  // Memoized function to initialize state for creating a new program and avoid re-rendering
  const initializeNewProgramState = useCallback(() => {
    const newProgramId = uuidv4();
    const newWorkoutId = uuidv4();

    const newProgram = {
      ...currentProgram.program,
      user_id: 2,
      id: newProgramId,
      name: 'Program 1X',
      program_duration: 0,
      duration_unit: 'Days',
      days_per_week: 0,
      main_goal: 'Strength'
    };

    const newWorkout = {
      id: newWorkoutId,
      programId: newProgramId,
      name: 'Workout 1',
      exercises: []
    };

    // Dispatch to initialize the new program state

    dispatch({
      type: actionTypes.INITIALIZE_NEW_PROGRAM_STATE,
      payload: {
        program: newProgram,
        workouts: [newWorkout],
        activeWorkout: null
      }
    });
  }, [dispatch]);

  // Memoized function to initialize state for editing a program

  const initializeEditProgramState = useCallback(
    (program, workouts) => {
      dispatch({
        type: actionTypes.INITIALIZE_EDIT_PROGRAM_STATE,
        payload: {
          program,
          workouts,
          activeWorkout: workouts.length > 0 ? workouts[0].id : null
        }
      });
    },
    [dispatch]
  );

  // Function to update a single field in the program

  const updateProgramField = (field, value) => {
    dispatch({
      type: actionTypes.UPDATE_PROGRAM_FIELD,
      payload: { [field]: value }
    });
  };

  // Save new program to backend

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
        type: actionTypes.UPDATE_PROGRAM_DATABASE, // Use the action for database updates
        payload: savedProgram // Entire updated program object from response
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
    // Always set the workoutId passed as the active one
    dispatch({
      type: actionTypes.SET_ACTIVE_WORKOUT,
      payload: { activeWorkout: workoutId }
    });
  };

  // const setActiveWorkout = workoutId => {
  //   if (state.workout.activeWorkout === workoutId) {
  //     // If the workout is already active, we clear it
  //     dispatch({
  //       type: actionTypes.SET_ACTIVE_WORKOUT,
  //       payload: { activeWorkout: null } // Clear active workout
  //     });
  //   } else {
  //     // If the workout is not active, we set it
  //     dispatch({
  //       type: actionTypes.SET_ACTIVE_WORKOUT,
  //       payload: { activeWorkout: workoutId } // Set new active workout
  //     });
  //   }
  // };

  // Add a new workout to the program

  const addWorkout = programId => {
    const newWorkout = {
      id: uuidv4(),
      programId: programId,
      name: 'Workout',
      exercises: []
    };

    dispatch({
      type: actionTypes.ADD_WORKOUT,
      payload: newWorkout
    });
  };

  // Function to update a single field in the program

  const updateWorkoutField = (field, value) => {
    dispatch({
      type: actionTypes.UPDATE_WORKOUT_FIELD,
      payload: { [field]: value } // Field and value as key-value pair
    });
  };

  // Update existing workout

  const updateWorkout = updatedWorkout => {
    dispatch({
      type: actionTypes.UPDATE_WORKOUT,
      payload: updatedWorkout
    });
  };

  // Delete a workout by ID

  const deleteWorkout = workoutId => {
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
      muscle: ex.muscle,
      equipment: ex.equipment,
      order: ex.order || null,
      sets: ex.sets || []
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
    // Directly access the activeWorkout ID

    const activeWorkoutId = state.workout.activeWorkout;

    if (!activeWorkoutId) {
      console.error('No active workout selected');
      return;
    }

    // Find the active workout using the ID
    const workout = state.workout.workouts.find(
      workout => workout.id === activeWorkoutId
    );

    if (!workout) {
      console.error('Active workout not found');
      return;
    }

    // Check if the exercise already exists in the workout's exercises array
    const exerciseExists = workout.exercises.some(ex => ex.id === exerciseId);

    if (exerciseExists) {
      // If the exercise exists, remove it
      dispatch({
        type: actionTypes.REMOVE_EXERCISE,
        payload: { workoutId: activeWorkoutId, exerciseId }
      });
    } else {
      // If the exercise doesn't exist, add it
      dispatch({
        type: actionTypes.ADD_EXERCISE,
        payload: {
          workoutId: activeWorkoutId,
          exercise: [exerciseData]
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
    console.log('Context - updateSet', workoutId, exerciseId, updatedSet);
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
        updateProgramField,
        initializeNewProgramState,
        initializeEditProgramState,
        addProgram,
        updateProgram,
        deleteProgram,
        addWorkout,
        updateWorkoutField,
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
