import React, { createContext, useReducer, useCallback } from 'react';
import * as Crypto from 'expo-crypto';
import { actionTypes } from '../actions/actionTypes';
import { workoutReducer } from '../reducers/workoutReducer';
import { currentWorkout } from '../reducers/workoutInitialState.js';
import { apiService } from '../services/api';
import { API_URL_MOBILE } from '@env';

// Initial state
const initialState = {
  program: null,
  userId: 2,
  programId: null,
  workoutName: '',
  duration: null,
  isCompleted: false,
  date: null,
  workout_id: null,
  exercises: [],
  sets: []
};

// Create the context
export const WorkoutContext = createContext();

// Create the provider component
export const WorkoutProvider = ({ children }) => {
  const [state, dispatch] = useReducer(workoutReducer, initialState);

  const updateWorkoutDuration = useCallback(minutes => {
    dispatch({
      type: actionTypes.UPDATE_WORKOUT_DURATION,
      payload: minutes
    });
  }, []);

  // Action creators

  const fetchActiveProgramDetails = useCallback(async () => {
    try {
      const data = await apiService.getActiveProgram();

      if (data.activeProgram) {
        // Fetch the full program details

        // const programDetails = await apiService.getProgram(
        //   data.activeProgram.programId
        // );

        // Set both the active program ID and its details
        dispatch({
          type: actionTypes.SET_ACTIVE_PROGRAM,
          payload: data.activeProgram.programId
        });

        return true; // Program exists
      }
      return false; // No active program
    } catch (error) {
      console.error('Error fetching active program details:', error);
      return false;
    }
  }, []);

  const setActiveProgram = useCallback(activeProgram => {
    dispatch({ type: actionTypes.SET_ACTIVE_PROGRAM, payload: activeProgram });
  }, []);

  const setActiveWorkout = workoutId => {
    dispatch({
      type: actionTypes.SET_ACTIVE_WORKOUT,
      payload: workoutId
    });
  };

  // Initialize a new flex workout
  const initializeFlexWorkout = () => {
    dispatch({ type: actionTypes.INITIALIZE_FLEX_WORKOUT });
  };

  // Initialize a new program workout
  const initializeProgramWorkout = useCallback(programData => {
    dispatch({
      type: actionTypes.INITIALIZE_PROGRAM_WORKOUT,
      payload: {
        programId: programData.programId,
        workoutName: programData.workoutName,
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
      catalogExerciseId: exercise.catalogExerciseId,
      name: exercise.name,
      muscle: exercise.muscle,
      equipment: exercise.equipment,
      imageUrl: exercise.imageUrl,
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
      catalogExerciseId: exercise.catalogExerciseId || exercise.id,
      order: exercise.order || 0,
      // Include other exercise properties
      name: exercise.name,
      muscle: exercise.muscle,
      equipment: exercise.equipment,
      imageUrl: exercise.imageUrl,
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
        setActiveWorkout,
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
