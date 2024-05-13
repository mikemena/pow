import { v4 as uuidv4 } from 'uuid';
import { initialState } from './initialState';

function exerciseReducer(state = initialState, action) {
  switch (action.type) {
    case 'ADD_EXERCISE':
      // Assuming action.payload contains all necessary details for the exercise,
      // including the workoutId to which it should be linked.
      const newId = uuidv4();
      return {
        ...state,
        [newId]: {
          id: newId,
          ...action.payload,
          isNew: true
        }
      };

    case 'UPDATE_EXERCISE':
      // action.payload should include the id of the exercise to update
      // and the properties to be updated.
      if (state[action.payload.id]) {
        return {
          ...state,
          [action.payload.id]: {
            ...state[action.payload.id],
            ...action.payload.updates
          }
        };
      }
      return state;

    case 'DELETE_EXERCISE':
      // action.payload should be the id of the exercise to delete.
      const newState = { ...state };
      delete newState[action.payload];
      return newState;

    default:
      return state;
  }
}

export { exerciseReducer };
