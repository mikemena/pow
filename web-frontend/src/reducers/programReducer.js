// import { actionTypes } from '../actions/actionTypes';
import { initialState } from './initialState';

function programReducer(state = initialState.programs, action) {
  switch (action.type) {
    case 'UPDATE_PROGRAM_DETAILS':
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

      return {
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

    default:
      return state;
  }
}

export { programReducer };
