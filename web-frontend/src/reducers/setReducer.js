import { v4 as uuidv4 } from 'uuid';
import { actionTypes } from '../actions/actionTypes';

function setReducer(state = {}, action) {
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

      const newState = {
        ...state,
        [exerciseId]: [...(state[exerciseId] || []), newSet]
      };

      return newState;
    }

    case actionTypes.UPDATE_SET: {
      const { exerciseId, updatedSet } = action.payload;

      return {
        ...state,
        [exerciseId]: state[exerciseId].map(set =>
          set.id === updatedSet.id
            ? { ...set, ...updatedSet, id: updatedSet.id }
            : set
        )
      };
    }

    case actionTypes.DELETE_SET: {
      const { exerciseId, setId } = action.payload;

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
