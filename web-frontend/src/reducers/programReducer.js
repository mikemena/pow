import { initialContextState } from '../contexts/programContext';

function programReducer(state = initialContextState.program, action) {
  switch (action.type) {
    case 'SET_SELECTED_PROGRAM':
      return {
        ...state,
        selectedProgram: action.payload.program,
        selectedWorkouts: action.payload.workouts
      };

    case 'ADD_PROGRAM':
    case 'UPDATE_PROGRAM':
    case 'UPDATE_PROGRAM_SUCCESS':
      return {
        ...state,
        ...action.payload
      };

    case 'DELETE_PROGRAM':
      return initialContextState.program;

    default:
      return state;
  }
}

export { programReducer };
