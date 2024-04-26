import { initialState } from './programReducer';

function programReducer(state = initialState, action) {
  switch (action.type) {
    //For updating basic program information like name, duration, etc.
    case 'UPDATE_PROGRAM_DETAILS':
      return {
        ...state,
        program: { ...state.program, ...action.payload }
      };

    default:
      return state;
  }
}

export { programReducer, initialState };
