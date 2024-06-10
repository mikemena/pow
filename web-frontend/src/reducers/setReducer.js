import { v4 as uuidv4 } from 'uuid';
import { initialState } from './initialState';

function setReducer(state = initialState, action) {
  switch (action.type) {
    case 'ADD_SET': {
      const { workoutId, exerciseId, count, weight } = action.payload;
      const setId = uuidv4();
      return {
        ...state,
        programs: {
          ...state.programs,
          workouts: state.programs.workouts.map(workout => {
            if (workout.id === workoutId) {
              return {
                ...workout,
                exercises: workout.exercises.map(exercise => {
                  if (exercise.id === exerciseId) {
                    const newSet = {
                      id: setId,
                      count,
                      weight,
                      exerciseId
                    };
                    return {
                      ...exercise,
                      sets: [...exercise.sets, newSet]
                    };
                  }
                  return exercise;
                })
              };
            }
            return workout;
          })
        }
      };
    }

    case 'UPDATE_SET': {
      return {
        ...state,
        programs: {
          ...state.programs,
          workouts: state.programs.workouts.map(workout => {
            if (workout.id === action.payload.workoutId) {
              return {
                ...workout,
                exercises: workout.exercises.map(exercise => {
                  if (exercise.id === action.payload.exerciseId) {
                    return {
                      ...exercise,
                      sets: exercise.sets.map(set => {
                        if (set.id === action.payload.updatedSet.id) {
                          // Assuming you have set ID to match on
                          return { ...set, ...action.payload.updatedSet };
                        }
                        return set;
                      })
                    };
                  }
                  return exercise;
                })
              };
            }
            return workout;
          })
        }
      };
    }

    case 'DELETE_SET': {
      return {
        ...state,
        programs: {
          ...state.programs,
          workouts: state.programs.workouts.map(workout => {
            if (workout.id === action.payload.workoutId) {
              return {
                ...workout,
                exercises: workout.exercises.map(exercise => {
                  if (exercise.id === action.payload.exerciseId) {
                    const filteredAndRenumberedSets = exercise.sets.filter(
                      set => set.id !== action.payload.setId
                    );
                    return {
                      ...exercise,
                      sets: filteredAndRenumberedSets
                    };
                  }
                  return exercise;
                })
              };
            }
            return workout;
          })
        }
      };
    }

    default:
      return state;
  }
}

export { setReducer, initialState };
