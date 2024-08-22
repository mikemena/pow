function programReducer(state, action) {
  switch (action.type) {
    case 'SET_PROGRAMS': {
      const { programs, workouts, activeWorkout, selectedProgram } =
        action.payload;
      return {
        ...state,
        programs,
        workouts,
        activeWorkout,
        selectedProgram
      };
    }

    case 'SET_SELECTED_PROGRAM':
      return {
        ...state,
        selectedProgram: action.payload.program
          ? action.payload.program.id
          : null,
        program: action.payload.program || null,
        programs: action.payload.programs || {},
        workouts: action.payload.workouts || {}
      };

    case 'DESELECT_PROGRAM': {
      const { programId } = action.payload;

      if (!state.program || state.program.id !== programId) {
        console.error('Program not found or invalid payload:', action.payload);
        return state;
      }

      return {
        ...state,
        program: {
          ...state.program,
          selected: false
        },
        selectedProgram: null
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

      if (!state.program || state.program.id !== id) {
        console.error('Program not found:', id);
        return state;
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

      return {
        ...state,
        program: {
          ...state.program,
          ...updatedProgram
        }
      };
    }

    case 'UPDATE_PROGRAM_SUCCESS': {
      const updatedProgram = action.payload;

      if (!updatedProgram || !updatedProgram.id) {
        console.error('Invalid program data received:', updatedProgram);
        return state;
      }

      return {
        ...state,
        program: {
          ...state.program,
          ...updatedProgram
        },
        selectedProgram: updatedProgram.id
      };
    }

    case 'DELETE_PROGRAM': {
      const { programId } = action.payload;

      if (!programId || state.program.id !== programId) {
        console.error('Program not found or invalid payload:', action.payload);
        return state;
      }

      // Reset the state to remove the program
      return {
        ...state,
        program: null,
        selectedProgram: null,
        activeWorkout: null
      };
    }

    default:
      return state;
  }
}

export { programReducer };
