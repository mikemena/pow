function programReducer(state, action) {
  switch (action.type) {
    case 'INITIALIZE_EDIT_PROGRAM_STATE':
      return {
        program: action.payload.program,
        workout: {
          workouts: action.payload.workouts,
          activeWorkout: action.payload.activeWorkout
        }
      };

    case 'INITIALIZE_NEW_PROGRAM_STATE':
      return {
        program: action.payload.program,
        workout: {
          workouts: action.payload.workouts,
          activeWorkout: action.payload.activeWorkout
        }
      };
    case 'UPDATE_NEW_PROGRAM':
      return {
        ...state,
        ...action.payload
      };
    case 'UPDATE_SELECTED_PROGRAM':
      return {
        ...state,
        selectedProgram: {
          ...state.selectedProgram,
          ...action.payload
        }
      };

    case 'ADD_PROGRAM':
    case 'UPDATE_PROGRAM':
    case 'UPDATE_PROGRAM_SUCCESS':
      return {
        ...state,
        ...action.payload
      };

    case 'CLEAR_PROGRAM':
      return {
        ...state,
        ...action.payload
      };

    default:
      return state;
  }
}

export { programReducer };
