import React, { createContext, useReducer, useCallback } from 'react';
import * as Crypto from 'expo-crypto';

// Define action types
const actionTypes = {
  SET_ACTIVE_PROGRAM: 'SET_ACTIVE_PROGRAM',
  START_WORKOUT: 'START_WORKOUT',
  ADD_EXERCISE_TO_WORKOUT: 'ADD_EXERCISE_TO_WORKOUT',
  REMOVE_EXERCISE_FROM_WORKOUT: 'REMOVE_EXERCISE_FROM_WORKOUT',
  ADD_SET: 'ADD_SET',
  UPDATE_SET: 'UPDATE_SET',
  REMOVE_SET: 'REMOVE_SET',
  COMPLETE_WORKOUT: 'COMPLETE_WORKOUT',
  CLEAR_CURRENT_WORKOUT: 'CLEAR_CURRENT_WORKOUT'
};

// Initial state
const initialState = {
  activeProgram: null,
  currentWorkout: null
};

// Reducer function
const workoutReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_ACTIVE_PROGRAM:
      return { ...state, activeProgram: action.payload };
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

  // Action creators
  const setActiveProgram = useCallback(program => {
    dispatch({ type: actionTypes.SET_ACTIVE_PROGRAM, payload: program });
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
        setActiveProgram,
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
