import { actionTypes } from '../actions/actionTypes';
import { initialState } from './initialState';

function selectedProgramReducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.SET_SELECTED_PROGRAM:
      return {
        ...state,
        selectedProgram: action.payload
      };

    default:
      return state;
  }
}

export { selectedProgramReducer };
