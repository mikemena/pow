import { v4 as uuidv4 } from 'uuid';
import { actionTypes } from '../actions/actionTypes';
import { initialState } from './initialState';

function setReducer(state = initialState.sets, action) {
  switch (action.type) {
    case actionTypes.ADD_SET: {
      const { exerciseId, weight, reps } = action.payload;
      const setId = uuidv4();
      const newSet = {
        id: setId,
        weight,
        reps,
        order: (state[exerciseId] || []).length + 1
      };

      // console.log('Adding new set:', newSet);
      // console.log('State before:', state);

      const newState = {
        ...state,
        [exerciseId]: [...(state[exerciseId] || []), newSet]
      };

      // console.log('State after:', newState);

      return newState;
    }

    case actionTypes.UPDATE_SET: {
      const { exerciseId, updatedSet } = action.payload;
      // console.log('Updating set:', updatedSet);

      return {
        ...state,
        [exerciseId]: state[exerciseId].map(set =>
          set.id === updatedSet.id ? { ...set, ...updatedSet } : set
        )
      };
    }

    case actionTypes.DELETE_SET: {
      const { exerciseId, setId } = action.payload;
      // console.log('Deleting set with id:', setId);

      const updatedSets = state[exerciseId]
        .filter(set => set.id !== setId)
        .map((set, index) => ({ ...set, order: index + 1 }));

      return {
        ...state,
        [exerciseId]: updatedSets
      };
    }
    default:
      return state;
  }
}

export { setReducer };
