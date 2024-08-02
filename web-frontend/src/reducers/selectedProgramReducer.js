import { actionTypes } from '../actions/actionTypes';
import { initialState } from './initialState';

function selectedProgramReducer(state = initialState, action) {
  console.log('Action Type:', action.type);
  console.log('State Before:', state);

  switch (action.type) {
    case actionTypes.SET_SELECTED_PROGRAM:
      console.log('Setting selectedProgram:', action.payload);
      return {
        ...state,
        selectedProgram: action.payload
      };

    default:
      return state;
  }
}

export { selectedProgramReducer };
