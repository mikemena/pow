import { v4 as uuidv4 } from 'uuid';
import { initialState } from './initialState';

function workoutReducer(state = initialState, action) {
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
        [action.payload.id]: {
          // Update the specific workout by its ID
          ...state[action.payload.id],
          ...action.payload
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
