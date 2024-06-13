import { v4 as uuidv4 } from 'uuid';
import { initialState } from './initialState';

function setReducer(state = initialState.sets, action) {
  switch (action.type) {
    case 'ADD_SET': {
      const { workoutId, exerciseId, weight, reps } = action.payload;
      const setId = uuidv4();
      const newSet = {
        id: setId,
        weight,
        reps,
        order: (state[exerciseId] || []).length + 1
      };

      return {
        ...state,
        [exerciseId]: [...(state[exerciseId] || []), newSet]
      };
    }

    case 'UPDATE_SET': {
      const { workoutId, exerciseId, updatedSet } = action.payload;

      return {
        ...state,
        [exerciseId]: state[exerciseId].map(set =>
          set.id === updatedSet.id ? { ...set, ...updatedSet } : set
        )
      };
    }

    case 'DELETE_SET': {
      const { workoutId, exerciseId, setId } = action.payload;

      return {
        ...state,
        [exerciseId]: state[exerciseId].filter(set => set.id !== setId)
      };
    }

    default:
      return state;
  }
}

export { setReducer };
