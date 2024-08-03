import { v4 as uuidv4 } from 'uuid';
import { actionTypes } from '../actions/actionTypes';
import { initialState } from './initialState';
import { standardizeWorkout } from '../utils/standardizeWorkout';

function workoutReducer(state = initialState.workouts, action) {
  console.log('Action Type:', action.type);
  console.log('State Before:', state);
  console.log('Action Payload:', action.payload);

  switch (action.type) {
    case actionTypes.ADD_WORKOUT:
      console.log('Action Type: ADD_WORKOUT');
      console.log('State Before:', state);
      console.log('Action Payload:', action.payload);

      const newWorkout = standardizeWorkout(action.payload);
      if (!newWorkout) return state;
      console.log('Adding workout in reducer:', newWorkout);
      if (!newWorkout) {
        console.error('Failed to standardize workout:', action.payload);
        return state;
      }
      return {
        ...state,
        [newWorkout.id]: newWorkout
      };

    case actionTypes.UPDATE_WORKOUT:
      const updatedWorkout = standardizeWorkout(action.payload);
      if (!updatedWorkout) return state;
      console.log('Updating workout in reducer:', updatedWorkout);
      return {
        ...state,
        [updatedWorkout.id]: updatedWorkout
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
