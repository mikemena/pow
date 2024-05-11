import { initialState } from './initialState';

function programReducer(state = initialState, action) {
  switch (action.type) {
    //For updating basic program information like name, duration, etc.
    case 'UPDATE_PROGRAM_DETAILS':
      return {
        ...state,
        [action.payload.id]: {
          ...state[action.payload.id],
          ...action.payload
        }
      };
    default:
      return state;
  }
}

export { programReducer, initialState };
