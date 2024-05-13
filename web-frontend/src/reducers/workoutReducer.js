import { v4 as uuidv4 } from 'uuid';
import { initialState } from './initialState';

function workoutReducer(state = initialState, action) {
  console.log('workoutReducer: Action:', action);
  console.log('State in workoutReducer:', state);
  switch (action.type) {
    case 'ADD_WORKOUT': {
      const workoutId = uuidv4(); // Generate a unique ID for the new workout
      const workoutTitle =
        action.payload.name || `Workout ${Object.keys(state).length + 1}`;
      const newWorkout = {
        id: workoutId,
        name: workoutTitle,
        exercises: [],
        active: false,
        programId: action.payload.programId // Ensure this is passed in action.payload
      };

      return {
        ...state,
        [workoutId]: newWorkout // Add new workout under its ID
      };
    }

    case 'UPDATE_WORKOUT': {
      return {
        ...state,
        workouts: {
          [action.payload.id]: {
            ...state[action.payload.id],
            ...action.payload
          }
        }
      };
    }

    case 'DELETE_WORKOUT': {
      const newState = { ...state };
      delete newState[action.payload]; // Remove the workout by its ID
      return newState;
    }

    default:
      return state;
  }
}

export { workoutReducer };
