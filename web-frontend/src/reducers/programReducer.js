import { initialState } from './initialState';

function programReducer(state = initialState.programs, action) {
  switch (action.type) {
    case 'SET_SELECTED_PROGRAM':
      console.log('SET_SELECTED_PROGRAM action:', action.payload);
      const newState = {
        ...state,
        selectedProgram: action.payload
      };
      console.log('New state after SET_SELECTED_PROGRAM:', newState);
      return newState;

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

      return updatedState;

    case 'UPDATE_PROGRAM': {
      const updatedProgram = action.payload;
      console.log('Updating program in reducer:', updatedProgram);

      return {
        ...state,
        selectedProgram: updatedProgram,
        [updatedProgram.id]: updatedProgram
      };
    }

    case 'UPDATE_PROGRAM_SUCCESS': {
      const updatedProgram = action.payload;
      console.log('Updating program in reducer:', updatedProgram);

      if (!updatedProgram || !updatedProgram.id) {
        console.error('Invalid program data received:', updatedProgram);
        return state;
      }

      const updatedState = {
        ...state,
        [updatedProgram.id]: updatedProgram,
        selectedProgram: updatedProgram
      };

      console.log('Updated state after UPDATE_PROGRAM_SUCCESS:', updatedState);
      return updatedState;
    }

    case 'DELETE_PROGRAM': {
      const { programId } = action.payload;

      if (!programId) {
        console.error('Invalid payload for DELETE_PROGRAM', action.payload);
        return state;
      }

      const newPrograms = { ...state.programs };
      delete newPrograms[programId];

      const newState = {
        ...state,
        programs: newPrograms
      };

      return newState;
    }

    default:
      return state;
  }
}

export { programReducer };
