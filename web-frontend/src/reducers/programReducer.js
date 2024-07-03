import { initialState } from './initialState';

function programReducer(state = initialState.programs, action) {
  switch (action.type) {
    case 'ADD_PROGRAM':
      const {
        id,
        name,
        program_duration,
        duration_unit,
        days_per_week,
        main_goal
      } = action.payload;

      if (!state[id]) {
        console.error('Program not found:', id);
        return state; // Return the current state if the program ID does not exist.
      }

      const updatedState = {
        ...state,
        [id]: {
          ...state[id], // Spread the existing program details
          name,
          program_duration,
          duration_unit,
          days_per_week,
          main_goal
        }
      };
      console.log('Reducer updated program state:', updatedState);
      return updatedState;

    case 'DELETE_PROGRAM': {
      if (!action.payload) {
        console.error('Invalid payload for DELETE_PROGRAM', action.payload);
        return state;
      }

      const newPrograms = { ...state };
      delete newPrograms[action.payload];
      const newState = {
        ...newPrograms
      };
      console.log('State After DELETE_PROGRAMS:', newState);
      return newState;
    }

    default:
      return state;
  }
}

export { programReducer };
