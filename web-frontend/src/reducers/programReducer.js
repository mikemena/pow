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
      // console.log('Reducer updated program state:', updatedState);
      return updatedState;

    case 'DELETE_PROGRAM': {
      const { programId } = action.payload;

      if (!programId) {
        console.error('Invalid payload for DELETE_PROGRAM', action.payload);
        return state;
      }

      // console.log(`Deleting program with ID: ${programId}`);
      const newPrograms = { ...state.programs };
      delete newPrograms[programId];

      const newState = {
        ...state,
        programs: newPrograms
      };

      // console.log('State After DELETE_PROGRAMS:', newState);
      return newState;
    }

    default:
      return state;
  }
}

export { programReducer };
