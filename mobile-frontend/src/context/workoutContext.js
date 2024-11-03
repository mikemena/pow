import React, { createContext, useReducer, useCallback } from 'react';
import * as Crypto from 'expo-crypto';
import { actionTypes } from '../actions/actionTypes';
import { API_URL_MOBILE } from '@env';

// Initial state
const initialState = {
  activeProgram: null,
  currentWorkout: null,
  workoutDetails: null
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

    case actionTypes.START_WORKOUT:
      return { ...state, currentWorkout: action.payload };

    case actionTypes.ADD_EXERCISE_TO_WORKOUT:
      return {
        ...state,
        currentWorkout: {
          ...state.currentWorkout,
          exercises: [...state.currentWorkout.exercises, action.payload]
        }
      };

    case actionTypes.REMOVE_EXERCISE_FROM_WORKOUT:
      return {
        ...state,
        currentWorkout: {
          ...state.currentWorkout,
          exercises: state.currentWorkout.exercises.filter(
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

  const fetchActiveProgramDetails = useCallback(async () => {
    try {
      const response = await fetch(
        `${API_URL_MOBILE}/api/active-programs/user/2`
      );
      const data = await response.json();
      console.log('Active program data:', data);

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

  // Fetch workout details
  const fetchWorkoutDetails = useCallback(async workoutId => {
    console.log('fetchWorkoutDetails called with ID:', workoutId);

    try {
      if (!workoutId) {
        throw new Error('Workout ID is required');
      }

      // Log the full URL being called
      const url = `${API_URL_MOBILE}/api/workout/${workoutId}`;
      console.log('Attempting to fetch from URL:', url);

      // Add explicit headers and log them
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      // Get response text first to see what we're dealing with
      const responseText = await response.text();
      console.log('Raw response:', responseText);

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

      console.log('Parsed workout details:', workoutDetails);

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
    const workout = {
      id: Crypto.randomUUID(),
      ...workoutData,
      exercises: [],
      startTime: new Date(),
      isCompleted: false
    };
    dispatch({ type: actionTypes.START_WORKOUT, payload: workout });
  }, []);

  const addExerciseToWorkout = useCallback(exercise => {
    const newExercise = {
      id: Crypto.randomUUID(),
      ...exercise,
      sets: []
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

  const removeSet = useCallback((exerciseId, setId) => {
    dispatch({ type: actionTypes.REMOVE_SET, payload: { exerciseId, setId } });
  }, []);

  const completeWorkout = useCallback(() => {
    dispatch({ type: actionTypes.COMPLETE_WORKOUT });
    // Here you would typically make an API call to save the completed workout
  }, []);

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
        fetchWorkoutDetails,
        clearWorkoutDetails,
        startWorkout,
        addExerciseToWorkout,
        removeExerciseFromWorkout,
        addSet,
        updateSet,
        removeSet,
        completeWorkout,
        clearCurrentWorkout
      }}
    >
      {children}
    </WorkoutContext.Provider>
  );
};
