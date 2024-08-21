import { initialState } from './initialState';

function programReducer(state = initialState, action) {
  switch (action.type) {
    case 'SET_SELECTED_PROGRAM': {
      const updatedProgram = action.payload;
      if (!updatedProgram || !updatedProgram.id) {
        console.error('Invalid program data received:', updatedProgram);
        return state;
      }
      console.log('Setting selected program in reducer:', updatedProgram);
      return {
        ...state,
        program: updatedProgram
      };
    }

    case 'DESELECT_PROGRAM': {
      const { programId } = action.payload;

      if (
        !state.program ||
        (state.program.id !== programId && state.program.tempId !== programId)
      ) {
        console.error('Program not found or invalid payload:', action.payload);
        return state;
      }

      return {
        ...state,
        program: {
          ...state.program,
          selected: false
        }
      };
    }

    case 'ADD_PROGRAM':
      const {
        id,
        name,
        program_duration,
        duration_unit,
        days_per_week,
        main_goal
      } = action.payload;

      if (
        !state.program ||
        (state.program.id !== id && state.program.tempId !== id)
      ) {
        console.error('Program not found:', id);
        return state; // Return the current state if the program ID does not exist.
      }

      const updatedProgram = {
        ...state.program,
        name,
        program_duration,
        duration_unit,
        days_per_week,
        main_goal
      };

      return {
        ...state,
        program: updatedProgram
      };

    case 'UPDATE_PROGRAM': {
      const updatedProgram = action.payload;
      console.log('Updating program in reducer:', updatedProgram);

      return {
        ...state,
        program: {
          ...state.program, // Spread the existing program details to preserve other fields like workouts
          ...updatedProgram // Overwrite with the updated program details
        }
      };
    }

    case 'UPDATE_PROGRAM_SUCCESS': {
      const updatedProgram = action.payload;
      console.log('Updating program in reducer:', updatedProgram);

      if (!updatedProgram || !updatedProgram.id) {
        console.error('Invalid program data received:', updatedProgram);
        return state;
      }

      return {
        ...state,
        program: {
          ...state.program,
          ...updatedProgram // Overwrite the program with the updated data
        },
        selectedProgram: updatedProgram.id // Optionally update the selected program ID
      };
    }

    case 'DELETE_PROGRAM': {
      const { programId } = action.payload;

      if (
        !programId ||
        (state.program.id !== programId && state.program.tempId !== programId)
      ) {
        console.error('Program not found or invalid payload:', action.payload);
        return state;
      }

      // Reset the state to remove the program
      return {
        ...state,
        program: null, // or initialState.program to reset to initial state
        selectedProgram: null, // Resetting selected program as well
        activeWorkout: null // Reset any active workout associated with the program
      };
    }

    default:
      return state;
  }
}

export { programReducer };
