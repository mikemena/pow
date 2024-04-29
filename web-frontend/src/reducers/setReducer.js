import { v4 as uuidv4 } from 'uuid';
import { initialState } from './programReducer';

function setReducer(state = initialState, action) {
  switch (action.type) {
    case 'ADD_SET':
      return {
        ...state,
        program: {
          ...state.program,
          workouts: state.program.workouts.map(workout => {
            if (workout.id === action.payload.workoutId) {
              return {
                ...workout,
                exercises: workout.exercises.map(exercise => {
                  if (exercise.id === action.payload.exerciseId) {
                    // Compute the next order for the new set
                    const nextOrder =
                      exercise.sets.length > 0
                        ? Math.max(...exercise.sets.map(set => set.order)) + 1
                        : 1;

                    const newSet = {
                      ...action.payload.newSet,
                      id: uuidv4(), // Generate a new ID for the set
                      order: nextOrder,
                      isNew: true
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

    case 'UPDATE_SET':
      return {
        ...state,
        program: {
          ...state.program,
          workouts: state.program.workouts.map(workout => {
            if (workout.id === action.payload.workoutId) {
              return {
                ...workout,
                exercises: workout.exercises.map(exercise => {
                  if (exercise.id === action.payload.exerciseId) {
                    return {
                      ...exercise,
                      sets: exercise.sets.map(set => {
                        if (set.order === action.payload.updatedSet.order) {
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
    case 'DELETE_SET':
      return {
        ...state,
        program: {
          ...state.program,
          workouts: state.program.workouts.map(workout => {
            if (workout.id === action.payload.workoutId) {
              return {
                ...workout,
                exercises: workout.exercises.map(exercise => {
                  if (exercise.id === action.payload.exerciseId) {
                    const filteredAndRenumberedSets = exercise.sets
                      .filter(set => set.id !== action.payload.setId)
                      .map((set, index) => ({ ...set, order: index + 1 }));

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

    default:
      return state;
  }
}

export { setReducer, initialState };
