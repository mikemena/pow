import { actionTypes } from '../actions/actionTypes';
import * as Crypto from 'expo-crypto';

const workoutReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_ACTIVE_PROGRAM:
      return {
        ...state,
        activeProgram: action.payload
      };

    case actionTypes.INITIALIZE_FLEX_WORKOUT:
      return {
        ...initialState,
        workoutName: 'Flex Workout',
        date: new Date(),
        workout_id: Crypto.randomUUID()
      };

    case actionTypes.INITIALIZE_PROGRAM_WORKOUT:
      const { programId, workoutName, workout_id } = action.payload;
      return {
        ...initialState,
        programId,
        workoutName,
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

    case actionTypes.SET_ACTIVE_WORKOUT:
      return {
        ...state,
        activeProgram: {
          ...state.activeProgram,
          workouts: state.activeProgram.workouts.map(workout => ({
            ...workout,
            selected: workout.id === action.payload
          }))
        }
      };

    case actionTypes.ADD_EXERCISE_TO_WORKOUT:
      const newExercise = {
        ...action.payload,
        id: action.payload.id || Crypto.randomUUID(),
        catalogExerciseId:
          action.payload.catalogExerciseId || action.payload.id,
        imageUrl: action.payload.imageUrl,
        sets: action.payload.sets || [
          { id: Crypto.randomUUID(), weight: '0', reps: '0', order: 1 }
        ]
      };

      // Create workoutDetails if it doesn't exist
      const updatedWorkoutDetails = state.workoutDetails || {
        id: state.workout_id,
        name: state.workoutName,
        exercises: []
      };

      return {
        ...state,
        exercises: [...state.exercises, newExercise],
        workoutDetails: {
          ...updatedWorkoutDetails,
          exercises: [...(updatedWorkoutDetails.exercises || []), newExercise]
        },
        currentWorkout: {
          ...(state.currentWorkout || {
            id: state.workout_id,
            name: state.workoutName,
            startTime: new Date(),
            isCompleted: false
          }),
          exercises: [...(state.currentWorkout?.exercises || []), newExercise]
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
          exercises: state.workoutDetails.exercises?.map(exercise =>
            exercise?.id === action.payload.exerciseId
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
export { workoutReducer };
