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
      console.log('Adding workout in reducer:', action.payload);
      return {
        ...state,
        [action.payload.id]: standardizeWorkout(action.payload)
      };

    case actionTypes.UPDATE_WORKOUT:
      console.log('Updating workout in reducer:', action.payload);
      return {
        ...state,
        [action.payload.id]: standardizeWorkout(action.payload)
      };

    case actionTypes.ADD_EXERCISE:
      const { workoutId, exercises } = action.payload;
      console.log('Adding exercise in reducer:', action.payload);
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

    default:
      return state;
  }
}

export { workoutReducer };
