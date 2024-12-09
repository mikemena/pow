import React, { createContext, useReducer, useCallback } from 'react';
import * as Crypto from 'expo-crypto';
import { actionTypes } from '../actions/actionTypes';
import { API_URL_MOBILE } from '@env';

// Initial state
const initialState = {
  user_id: 2,
  program_id: null,
  workout_name: '',
  duration: null,
  is_completed: false,
  date: null,
  workout_id: null,
  exercises: [],
  sets: []
};

// Reducer function
const workoutReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_ACTIVE_PROGRAM:
      return { ...state, activeProgram: action.payload };

    case actionTypes.SET_ACTIVE_PROGRAM_DETAILS:
      return {
        ...state,
        activeProgramDetails: action.payload
      };

    case actionTypes.INITIALIZE_FLEX_WORKOUT:
      return {
        ...initialState,
        workout_name: 'Flex Workout',
        date: new Date(),
        workout_id: Crypto.randomUUID()
      };

    case actionTypes.INITIALIZE_PROGRAM_WORKOUT:
      const { program_id, workout_name, workout_id } = action.payload;
      return {
        ...initialState,
        program_id,
        workout_name,
        workout_id,
        date: new Date(),
        activeProgram: state.activeProgram,
        activeProgramDetails: state.activeProgramDetails
      };

    case actionTypes.SET_WORKOUT_DETAILS:
      return {
        ...state,
        workoutDetails: action.payload
      };

    case actionTypes.CLEAR_WORKOUT_DETAILS:
      return {
        ...state,
        workoutDetails: null
      };

    case actionTypes.UPDATE_WORKOUT_NAME:
      return {
        ...state,
        workoutDetails: {
          ...state.workoutDetails,
          name: action.payload
        }
      };

    case actionTypes.START_WORKOUT:
      return {
        ...state,
        currentWorkout: action.payload,
        workoutDetails: action.payload,
        exercises: action.payload.exercises,
        workout_name: action.payload.name
      };

    case actionTypes.ADD_EXERCISE_TO_WORKOUT:
      return {
        ...state,
        exercises: [
          ...state.exercises,
          {
            ...action.payload,
            id: action.payload.id || Crypto.randomUUID(),
            catalog_exercise_id:
              action.payload.catalog_exercise_id || action.payload.id,
            sets: action.payload.sets || [
              { id: Crypto.randomUUID(), weight: '0', reps: '0', order: 1 }
            ]
          }
        ]
      };

    case actionTypes.REMOVE_EXERCISE_FROM_WORKOUT:
      return {
        ...state,
        currentWorkout: {
          ...state.currentWorkout,
          exercises: state.currentWorkout.exercises.filter(
            exercise => exercise.id !== action.payload
          )
        },
        workoutDetails: {
          ...state.workoutDetails,
          exercises: state.workoutDetails.exercises.filter(
            exercise => exercise.id !== action.payload
          )
        }
      };

    case actionTypes.ADD_SET:
      return {
        ...state,
        currentWorkout: {
          ...state.currentWorkout,
          exercises: state.currentWorkout.exercises.map(exercise =>
            exercise.id === action.payload.exerciseId
              ? { ...exercise, sets: [...exercise.sets, action.payload.set] }
              : exercise
          )
        }
      };

    case actionTypes.UPDATE_SET:
      return {
        ...state,
        currentWorkout: {
          ...state.currentWorkout,
          exercises: state.currentWorkout.exercises.map(exercise =>
            exercise.id === action.payload.exerciseId
              ? {
                  ...exercise,
                  sets: exercise.sets.map(set =>
                    set.id === action.payload.setId
                      ? { ...set, ...action.payload.updates }
                      : set
                  )
                }
              : exercise
          )
        }
      };

    case actionTypes.UPDATE_EXERCISE_SETS:
      return {
        ...state,
        workoutDetails: {
          ...state.workoutDetails,
          exercises: state.workoutDetails.exercises.map(exercise =>
            exercise.id === action.payload.exerciseId
              ? { ...exercise, sets: action.payload.sets }
              : exercise
          )
        }
      };

    case actionTypes.REMOVE_SET:
      return {
        ...state,
        currentWorkout: {
          ...state.currentWorkout,
          exercises: state.currentWorkout.exercises.map(exercise =>
            exercise.id === action.payload.exerciseId
              ? {
                  ...exercise,
                  sets: exercise.sets.filter(
                    set => set.id !== action.payload.setId
                  )
                }
              : exercise
          )
        }
      };

    case actionTypes.UPDATE_WORKOUT_DURATION:
      console.log('Reducer updating duration:', action.payload);
      return {
        ...state,
        workoutDetails: {
          ...state.workoutDetails,
          duration: action.payload
        }
      };

    case actionTypes.COMPLETE_WORKOUT:
      return {
        ...state,
        currentWorkout: { ...state.currentWorkout, isCompleted: true }
      };
    case actionTypes.CLEAR_CURRENT_WORKOUT:
      return { ...state, currentWorkout: null };
    default:
      return state;
  }
};

// Create the context
export const WorkoutContext = createContext();

// Create the provider component
export const WorkoutProvider = ({ children }) => {
  const [state, dispatch] = useReducer(workoutReducer, initialState);

  const updateWorkoutDuration = useCallback(minutes => {
    console.log('Updating workout duration:', minutes);
    dispatch({
      type: actionTypes.UPDATE_WORKOUT_DURATION,
      payload: minutes
    });
  }, []);

  const fetchActiveProgramDetails = useCallback(async () => {
    try {
      const response = await fetch(
        `${API_URL_MOBILE}/api/active-programs/user/2`
      );
      const data = await response.json();

      if (data.activeProgram) {
        // Fetch the full program details
        const programResponse = await fetch(
          `${API_URL_MOBILE}/api/programs/${data.activeProgram.program_id}`
        );
        const programDetails = await programResponse.json();

        // Set both the active program ID and its details
        dispatch({
          type: actionTypes.SET_ACTIVE_PROGRAM,
          payload: data.activeProgram.program_id
        });
        dispatch({
          type: actionTypes.SET_ACTIVE_PROGRAM_DETAILS,
          payload: programDetails
        });

        return true; // Program exists
      }
      return false; // No active program
    } catch (error) {
      console.error('Error fetching active program details:', error);
      return false;
    }
  }, []);

  // Action creators
  const setActiveProgram = useCallback(programId => {
    dispatch({ type: actionTypes.SET_ACTIVE_PROGRAM, payload: programId });
  }, []);

  const setActiveProgramDetails = useCallback(programDetails => {
    dispatch({
      type: actionTypes.SET_ACTIVE_PROGRAM_DETAILS,
      payload: programDetails
    });
  }, []);

  // Function to set both ID and details at once
  const setActiveProgramWithDetails = useCallback(program => {
    dispatch({ type: actionTypes.SET_ACTIVE_PROGRAM, payload: program.id });
    dispatch({
      type: actionTypes.SET_ACTIVE_PROGRAM_DETAILS,
      payload: program
    });
  }, []);

  // Initialize a new flex workout
  const initializeFlexWorkout = () => {
    dispatch({ type: actionTypes.INITIALIZE_FLEX_WORKOUT });
  };

  // Initialize a new program workout
  const initializeProgramWorkout = useCallback(programData => {
    dispatch({
      type: actionTypes.INITIALIZE_PROGRAM_WORKOUT,
      payload: {
        program_id: programData.program_id,
        workout_name: programData.workout_name,
        workout_id: programData.workout_id
      }
    });
  }, []);

  // Update workout name
  const updateWorkoutName = useCallback(name => {
    dispatch({
      type: actionTypes.UPDATE_WORKOUT_NAME,
      payload: name
    });
  }, []);

  // Fetch workout details
  const fetchWorkoutDetails = useCallback(async workoutId => {
    try {
      if (!workoutId) {
        throw new Error('Workout ID is required');
      }

      const url = `${API_URL_MOBILE}/api/workout/${workoutId}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      });

      // Get response text first to see what we're dealing with
      const responseText = await response.text();

      // Try to parse as JSON if possible
      let workoutDetails;
      try {
        workoutDetails = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse response as JSON:', parseError);
        throw new Error('Invalid JSON response from server');
      }

      if (!response.ok) {
        throw new Error(
          `HTTP error! status: ${response.status}, body: ${responseText}`
        );
      }

      if (!workoutDetails || !workoutDetails.id) {
        throw new Error('Invalid workout details received');
      }

      dispatch({
        type: actionTypes.SET_WORKOUT_DETAILS,
        payload: workoutDetails
      });

      return workoutDetails;
    } catch (error) {
      console.error('Error in fetchWorkoutDetails:', {
        error: error.message,
        workoutId,
        stack: error.stack,
        apiUrl: API_URL_MOBILE
      });

      throw error;
    }
  }, []);

  // Clear workout details when done
  const clearWorkoutDetails = useCallback(() => {
    dispatch({ type: actionTypes.CLEAR_WORKOUT_DETAILS });
  }, []);

  const startWorkout = useCallback(workoutData => {
    // First, standardize the exercises from the workout data
    const standardizedExercises = workoutData.exercises.map(exercise => ({
      id: exercise.id || Crypto.randomUUID(),
      exercise_id: exercise.id,
      catalog_exercise_id: exercise.catalog_exercise_id,
      name: exercise.name,
      muscle: exercise.muscle,
      equipment: exercise.equipment,
      imageUrl: exercise.file_url || exercise.imageUrl,
      sets: exercise.sets || []
    }));

    dispatch({
      type: actionTypes.START_WORKOUT,
      payload: {
        ...workoutData,
        exercises: standardizedExercises,
        id: workoutData.programWorkoutId || Crypto.randomUUID(),
        startTime: new Date(),
        isCompleted: false
      }
    });
  }, []);

  const addExerciseToWorkout = useCallback(exercise => {
    const newExercise = {
      // Map incoming exercise to match our state structure
      id: Crypto.randomUUID(),
      exercise_id: exercise.id || Crypto.randomUUID(),
      catalog_exercise_id: exercise.catalog_exercise_id || exercise.id,
      order: exercise.order || 0,
      // Include other exercise properties
      name: exercise.name,
      muscle: exercise.muscle,
      equipment: exercise.equipment,
      imageUrl: exercise.file_url || exercise.imageUrl,
      // Initialize empty sets array (sets will be managed separately)
      sets: exercise.sets || []
    };

    dispatch({
      type: actionTypes.ADD_EXERCISE_TO_WORKOUT,
      payload: newExercise
    });
  }, []);

  const removeExerciseFromWorkout = useCallback(exerciseId => {
    dispatch({
      type: actionTypes.REMOVE_EXERCISE_FROM_WORKOUT,
      payload: exerciseId
    });
  }, []);

  const addSet = useCallback((exerciseId, setData) => {
    const newSet = {
      id: Crypto.randomUUID(),
      ...setData
    };
    dispatch({
      type: actionTypes.ADD_SET,
      payload: { exerciseId, set: newSet }
    });
  }, []);

  const updateSet = useCallback((exerciseId, setId, updates) => {
    dispatch({
      type: actionTypes.UPDATE_SET,
      payload: { exerciseId, setId, updates }
    });
  }, []);

  const updateExerciseSets = useCallback((exerciseId, sets) => {
    dispatch({
      type: actionTypes.UPDATE_EXERCISE_SETS,
      payload: { exerciseId, sets }
    });
  }, []);

  const removeSet = useCallback((exerciseId, setId) => {
    dispatch({ type: actionTypes.REMOVE_SET, payload: { exerciseId, setId } });
  }, []);

  const completeWorkout = useCallback(
    async duration => {
      try {
        if (!state.currentWorkout) {
          throw new Error('No active workout to complete');
        }

        // Create workout data without program ID by default
        const workoutData = {
          userId: 2,
          name: state.workoutDetails.name,
          duration: duration,
          exercises: state.workoutDetails.exercises.map(exercise => ({
            id: exercise.id,
            sets: Array.isArray(exercise.sets)
              ? exercise.sets.map(set => ({
                  weight: parseInt(set.weight) || 0,
                  reps: parseInt(set.reps) || 0,
                  order: set.order
                }))
              : []
          }))
        };

        // Only add programId if it's from a program workout
        if (state.workoutDetails.programId) {
          workoutData.programId = state.workoutDetails.programId;
        }

        console.log('Preparing workout data:', {
          ...workoutData,
          duration: workoutData.duration,
          durationType: typeof workoutData.duration,
          programId: workoutData.programId || 'not included'
        });

        // Validate required fields (notice programId is not checked)
        if (
          !workoutData.userId ||
          !workoutData.name ||
          !workoutData.exercises ||
          typeof workoutData.duration !== 'number'
        ) {
          console.error('Missing or invalid required fields:', {
            hasUserId: !!workoutData.userId,
            hasName: !!workoutData.name,
            hasExercises: !!workoutData.exercises,
            exercisesLength: workoutData.exercises?.length,
            duration: workoutData.duration,
            durationType: typeof workoutData.duration
          });
          throw new Error('Missing required workout data');
        }

        const response = await fetch(`${API_URL_MOBILE}/api/workout/complete`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(workoutData)
        });

        const responseText = await response.text();
        console.log('Response from server:', responseText);

        if (!response.ok) {
          let errorMessage = 'Failed to save workout';
          try {
            const errorData = JSON.parse(responseText);
            errorMessage = `${errorData.message}${
              errorData.error ? ': ' + errorData.error : ''
            }`;
          } catch (parseError) {
            errorMessage = `Server error (${response.status}): ${responseText}`;
          }
          throw new Error(errorMessage);
        }

        dispatch({ type: actionTypes.COMPLETE_WORKOUT });
        dispatch({ type: actionTypes.CLEAR_CURRENT_WORKOUT });

        return true;
      } catch (error) {
        console.error('Error completing workout:', error);
        throw error;
      }
    },
    [state.currentWorkout, state.workoutDetails]
  );

  const clearCurrentWorkout = useCallback(() => {
    dispatch({ type: actionTypes.CLEAR_CURRENT_WORKOUT });
  }, []);

  return (
    <WorkoutContext.Provider
      value={{
        state,
        fetchActiveProgramDetails,
        setActiveProgram,
        setActiveProgramDetails,
        setActiveProgramWithDetails,
        initializeFlexWorkout,
        initializeProgramWorkout,
        fetchWorkoutDetails,
        clearWorkoutDetails,
        startWorkout,
        addExerciseToWorkout,
        removeExerciseFromWorkout,
        addSet,
        updateSet,
        updateExerciseSets,
        removeSet,
        completeWorkout,
        clearCurrentWorkout,
        updateWorkoutDuration,
        updateWorkoutName
      }}
    >
      {children}
    </WorkoutContext.Provider>
  );
};
