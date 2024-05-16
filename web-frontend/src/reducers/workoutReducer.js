import { v4 as uuidv4 } from 'uuid';
import { initialState } from './initialState';

function workoutReducer(state = initialState, action) {
  console.log('workoutReducer: Action:', action);
  console.log('State in workoutReducer:', state);
  console.log('State Programs in workoutReducer:', state.programs);
  switch (action.type) {
    case 'ADD_WORKOUT': {
      const workoutId = uuidv4();
      const workoutTitle =
        action.payload.name || `Workout ${Object.keys(state).length + 1}`;
      const newWorkout = {
        id: workoutId,
        name: workoutTitle,
        exercises: [],
        active: false,
        programId: action.payload.programId
      };

      return {
        ...state,
        [workoutId]: newWorkout
      };
    }

    case 'UPDATE_WORKOUT': {
      return {
        ...state,
        [action.payload.id]: {
          ...state[action.payload.id],
          ...action.payload
        }
      };
    }

    case 'DELETE_WORKOUT': {
      const newWorkouts = { ...state };
      delete newWorkouts[action.payload];
      return newWorkouts;
    }

    default:
      return state;
  }
}

export { workoutReducer };
