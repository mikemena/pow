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

    case actionTypes.CLEAR_WORKOUT_DETAILS:
      return {
        ...state,
        activeProgram: null
      };

    case actionTypes.UPDATE_WORKOUT_NAME:
      return {
        ...state,
        activeProgram: {
          ...state.activeProgram,
          workouts: state.activeProgram.workouts.map((workout, index) =>
            index === state.activeProgram.current_workout_index
              ? { ...workout, name: action.payload }
              : workout
          )
        }
      };

    case actionTypes.SET_ACTIVE_WORKOUT: {
      const selectedWorkout = state.activeProgram.workouts.find(
        workout => workout.id === action.payload
      );

      return {
        ...state,
        activeWorkout: selectedWorkout
          ? {
              ...selectedWorkout,
              isStarted: false,
              isCompleted: false
            }
          : null
      };
    }

    case actionTypes.START_WORKOUT:
      return {
        ...state,
        activeWorkout: {
          ...state.activeWorkout,
          ...action.payload,
          startTime: new Date(),
          isStarted: true,
          isCompleted: false
        }
      };

    case actionTypes.ADD_EXERCISE_TO_WORKOUT:
      if (!state.activeWorkout) return state;

      return {
        ...state,
        activeWorkout: {
          ...state.activeWorkout,
          exercises: [...(state.activeWorkout.exercises || []), action.payload]
        }
      };

    case actionTypes.REMOVE_EXERCISE_FROM_WORKOUT:
      return {
        ...state,
        activeWorkout: {
          ...state.activeWorkout,
          exercises: state.activeWorkout.exercises.filter(
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
        activeWorkout: {
          ...state.activeWorkout,
          exercises: state.activeWorkout.exercises.map(exercise =>
            exercise.id === action.payload.exerciseId
              ? { ...exercise, sets: [...exercise.sets, action.payload.set] }
              : exercise
          )
        }
      };

    case actionTypes.UPDATE_SET:
      return {
        ...state,
        activeWorkout: {
          ...state.activeWorkout,
          exercises: state.activeWorkout.exercises.map(exercise =>
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
        activeProgram: {
          ...state.activeProgram,
          workouts: state.activeProgram.workouts.map((workout, index) =>
            index === 0 // Assuming we're updating the first workout
              ? {
                  ...workout,
                  exercises: workout.exercises?.map(exercise =>
                    exercise?.id === action.payload.exerciseId
                      ? { ...exercise, sets: action.payload.sets }
                      : exercise
                  )
                }
              : workout
          )
        }
      };

    case actionTypes.REMOVE_SET:
      return {
        ...state,
        activeWorkout: {
          ...state.activeWorkout,
          exercises: state.activeWorkout.exercises.map(exercise =>
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
        activeWorkout: {
          ...state.activeWorkout,
          duration: action.payload
        }
      };

    case actionTypes.COMPLETE_WORKOUT:
      return {
        ...state,
        ...state.activeWorkout,
        isComplete: true,
        endTime: new Date()
      };

    case actionTypes.CLEAR_CURRENT_WORKOUT:
      return { ...state, activeWorkout: null };
    default:
      return state;
  }
};
export { workoutReducer };
