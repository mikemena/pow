import { initialState } from './initialState';

function programReducer(state = initialState, action) {
  console.log('Action Type:', action.type);
  console.log('State Before:', state);

  switch (action.type) {
    case 'ADD_PROGRAM':
      console.log('Action Type:', action.type);
      console.log('State Before:', state);
      console.log('Payload for ADD_PROGRAM:', action.payload);
      const {
        id,
        name,
        program_duration,
        duration_unit,
        days_per_week,
        main_goal,
        user_id
      } = action.payload;

      const updatedPrograms = {
        ...state.programs,
        [id]: {
          id,
          name,
          program_duration,
          duration_unit,
          days_per_week,
          main_goal,
          user_id
        }
      };

      const updatedState = {
        ...state,
        programs: updatedPrograms
      };
      console.log('Reducer updated program state:', updatedState);
      return updatedState;

    case 'UPDATE_PROGRAM': {
      console.log('Action Type:', action.type);
      console.log('State Before:', state);
      console.log('Payload for UPDATE_PROGRAM:', action.payload);
      const {
        id,
        name,
        program_duration,
        duration_unit,
        days_per_week,
        main_goal,
        user_id
      } = action.payload;

      const existingProgram = state.programs[id];
      if (!existingProgram) {
        console.error('Program not found:', id);
        return state;
      }

      const updatedPrograms = {
        ...state.programs,
        [id]: {
          ...existingProgram,
          name,
          program_duration,
          duration_unit,
          days_per_week,
          main_goal,
          user_id
        }
      };

      const updatedState = {
        ...state,
        programs: updatedPrograms
      };

      console.log('Reducer updated program state:', updatedState);
      return updatedState;
    }

    case 'UPDATE_PROGRAM_SUCCESS': {
      console.log('Payload for UPDATE_PROGRAM_SUCCESS:', action.payload);
      const {
        id,
        name,
        program_duration,
        duration_unit,
        days_per_week,
        main_goal,
        user_id
      } = action.payload;

      const existingProgram = state.programs[id];
      if (!existingProgram) {
        console.error('Program not found:', id);
        return state;
      }

      const updatedPrograms = {
        ...state.programs,
        [id]: {
          ...existingProgram,
          name,
          program_duration,
          duration_unit,
          days_per_week,
          main_goal,
          user_id
        }
      };

      const updatedState = {
        ...state,
        programs: updatedPrograms
      };

      console.log('Reducer updated program state:', updatedState);
      return updatedState;
    }

    case 'SET_PROGRAM': {
      console.log('Payload for SET_PROGRAM:', action.payload);
      const {
        id,
        name,
        program_duration,
        duration_unit,
        days_per_week,
        main_goal,
        user_id
      } = action.payload;

      return {
        ...state,
        programs: {
          ...state.programs,
          [id]: {
            id,
            name,
            program_duration,
            duration_unit,
            days_per_week,
            main_goal,
            user_id
          }
        }
      };
    }

    case 'DELETE_PROGRAM': {
      const { programId } = action.payload;

      if (!programId) {
        console.error('Invalid payload for DELETE_PROGRAM', action.payload);
        return state;
      }

      const newPrograms = { ...state.programs };
      delete newPrograms[programId];

      const newState = {
        ...state,
        programs: newPrograms
      };

      // console.log('State After DELETE_PROGRAMS:', newState);
      return newState;
    }

    default:
      return state;
  }
}

export { programReducer };
