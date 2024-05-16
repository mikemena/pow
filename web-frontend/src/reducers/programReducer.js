import { initialState } from './initialState';

function programReducer(state = initialState, action) {
  console.log('State in programReducer:', state);
  switch (action.type) {
    //For updating basic program information like name, duration, etc.
    case 'UPDATE_PROGRAM_DETAILS':
      return {
        ...state,
        programs: {
          ...state.programs,
          [action.payload.id]: {
            ...state.programs[action.payload.id],
            ...action.payload
          }
        }
      };
    default:
      return state;
  }
}

export { programReducer, initialState };
