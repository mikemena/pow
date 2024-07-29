import { initialState } from './initialState';

function currentProgramReducer(state = initialState.currentProgram, action) {
  switch (action.type) {
    case 'SET_CURRENT_PROGRAM':
      console.log('Setting current program:', action.payload);
      return {
        ...state,
        currentProgram: action.payload
      };

    default:
      return state;
  }
}

export { currentProgramReducer };
