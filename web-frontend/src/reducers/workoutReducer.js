import { v4 as uuidv4 } from 'uuid';
import { actionTypes } from '../actions/actionTypes';
import { initialState } from './initialState';

function workoutReducer(state = initialState.workouts, action) {
  // console.log('Action Type:', action.type);
  // console.log('State Before:', state);

  switch (action.type) {
    case actionTypes.ADD_WORKOUT: {
      if (!action.payload || !action.payload.programId) {
        console.error('Invalid payload for ADD_WORKOUT', action.payload);
        return state;
      }

      const workoutId = uuidv4();
      const workoutTitle =
        action.payload.name || `Workout ${Object.keys(state).length + 1}`;
      const newWorkout = {
        id: workoutId,
        name: workoutTitle,
        exercises: [],
        programId: action.payload.programId,
        order: Object.keys(state).length + 1
      };

      const newState = {
        ...state,
        [workoutId]: newWorkout
      };
      // console.log('State After ADD_WORKOUT:', newState);
      return newState;
    }

    case actionTypes.UPDATE_WORKOUT: {
      if (!action.payload || !action.payload.id) {
        console.error('Invalid payload for UPDATE_WORKOUT', action.payload);
        return state;
      }

      const workout = state[action.payload.id];
      if (!workout) {
        console.error(
          'Workout not found for UPDATE_WORKOUT',
          action.payload.id
        );
        return state;
      }

      const newState = {
        ...state,
        [action.payload.id]: {
          ...workout,
          ...action.payload,
          id: action.payload.id
        }
      };
      // console.log('State After UPDATE_WORKOUT:', newState);
      return newState;
    }

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
      // console.log('State After Default:', state);
      return state;
  }
}

export { workoutReducer };
