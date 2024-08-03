import { v4 as uuidv4 } from 'uuid';
import { actionTypes } from '../actions/actionTypes';
import { initialState } from './initialState';
import { standardizeWorkout } from '../utils/standardizeWorkout';

function workoutReducer(state = initialState.workouts, action) {
  switch (action.type) {
    case actionTypes.ADD_WORKOUT:
      return {
        ...state,
        [action.payload.id]: standardizeWorkout(action.payload)
      };

    case actionTypes.UPDATE_WORKOUT:
      return {
        ...state,
        [action.payload.id]: standardizeWorkout(action.payload)
      };

    case actionTypes.ADD_EXERCISE:
      const { workoutId, exercises } = action.payload;

      return {
        ...state,
        [workoutId]: {
          ...state[workoutId],
          exercises: [
            ...state[workoutId].exercises,
            ...exercises.map(ex => ({ ...ex, sets: ex.sets || [] }))
          ]
        }
      };

    case actionTypes.ADD_SET:
      const { exerciseId, weight, reps } = action.payload;
      const workout = state[action.payload.workoutId];
      if (!workout) return state;

      const updatedExercises = workout.exercises.map(exercise => {
        if (exercise.id === exerciseId) {
          return {
            ...exercise,
            sets: [
              ...exercise.sets,
              { id: uuidv4(), weight, reps, order: exercise.sets.length + 1 }
            ]
          };
        }
        return exercise;
      });

      return {
        ...state,
        [action.payload.workoutId]: {
          ...workout,
          exercises: updatedExercises
        }
      };

    case actionTypes.DELETE_WORKOUT: {
      if (!action.payload) {
        console.error('Invalid payload for DELETE_WORKOUT', action.payload);
        return state;
      }

      const { [action.payload]: deletedWorkout, ...remainingWorkouts } = state;
      const reorderedWorkouts = Object.values(remainingWorkouts)
        .sort((a, b) => a.order - b.order)
        .map((workout, index) => ({
          ...workout,
          order: index + 1
        }))
        .reduce((acc, workout) => {
          acc[workout.id] = workout;
          return acc;
        }, {});

      const newState = {
        ...reorderedWorkouts
      };

      return newState;
    }

    default:
      return state;
  }
}

export { workoutReducer };
