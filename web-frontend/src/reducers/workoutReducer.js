import { v4 as uuidv4 } from 'uuid';
import { actionTypes } from '../actions/actionTypes';
import exerciseUtils from '../utils/exercise.js';
import { standardizeWorkout } from '../utils/standardizeWorkout';

function workoutReducer(state = { workouts: [], activeWorkout: null }, action) {
  switch (action.type) {
    case actionTypes.SET_ACTIVE_WORKOUT:
      return {
        ...state,
        activeWorkout: action.payload
      };

    case actionTypes.ADD_WORKOUT: {
      console.log('ADD_WORKOUT action received in reducer');
      console.log('Current state:', state);
      console.log('Payload:', action.payload);

      const newWorkout = standardizeWorkout(action.payload);
      if (!newWorkout) {
        console.error('Failed to standardize workout:', action.payload);
        return state;
      }
      console.log('Standardized workout:', newWorkout);

      return {
        ...state,
        workouts: [...state.workouts, newWorkout]
      };
    }

    case actionTypes.UPDATE_WORKOUT: {
      const updatedWorkout = action.payload;
      return {
        ...state,
        workouts: state.workouts.map(workout =>
          workout.id === updatedWorkout.id ? updatedWorkout : workout
        )
      };
    }

    case actionTypes.DELETE_WORKOUT: {
      const workoutId = action.payload;
      return {
        ...state,
        workouts: state.workouts.filter(workout => workout.id !== workoutId),
        activeWorkout:
          state.activeWorkout === workoutId ? null : state.activeWorkout
      };
    }

    case actionTypes.ADD_EXERCISE: {
      const { workoutId, exercises } = action.payload;
      return {
        ...state,
        workouts: state.workouts.map(workout => {
          if (workout.id === workoutId) {
            return {
              ...workout,
              exercises: [
                ...workout.exercises,
                ...exercises.map(ex => ({
                  ...exerciseUtils.standardizeExercise(ex),
                  id: ex.id || uuidv4(),
                  tempId: ex.tempId || uuidv4()
                }))
              ]
            };
          }
          return workout;
        })
      };
    }

    case actionTypes.REMOVE_EXERCISE: {
      const { workoutId, exerciseId } = action.payload;
      return {
        ...state,
        workouts: state.workouts.map(workout => {
          if (workout.id === workoutId) {
            return {
              ...workout,
              exercises: workout.exercises.filter(
                ex =>
                  ex.id !== exerciseId &&
                  ex.tempId !== exerciseId &&
                  ex.catalog_exercise_id !== exerciseId
              )
            };
          }
          return workout;
        })
      };
    }

    case actionTypes.ADD_SET: {
      const { workoutId, exerciseId, newSet } = action.payload;
      return {
        ...state,
        workouts: state.workouts.map(workout => {
          if (workout.id === workoutId) {
            return {
              ...workout,
              exercises: workout.exercises.map(exercise => {
                if (
                  exercise.id === exerciseId ||
                  exercise.tempId === exerciseId
                ) {
                  return {
                    ...exercise,
                    sets: [...exercise.sets, { ...newSet, id: uuidv4() }]
                  };
                }
                return exercise;
              })
            };
          }
          return workout;
        })
      };
    }

    case actionTypes.UPDATE_SET: {
      const { workoutId, exerciseId, updatedSet } = action.payload;
      return {
        ...state,
        workouts: state.workouts.map(workout => {
          if (workout.id === workoutId) {
            return {
              ...workout,
              exercises: workout.exercises.map(exercise => {
                if (
                  exercise.id === exerciseId ||
                  exercise.tempId === exerciseId
                ) {
                  return {
                    ...exercise,
                    sets: exercise.sets.map(set =>
                      set.id === updatedSet.id ||
                      set.tempId === updatedSet.tempId
                        ? { ...set, ...updatedSet }
                        : set
                    )
                  };
                }
                return exercise;
              })
            };
          }
          return workout;
        })
      };
    }

    case actionTypes.REMOVE_SET: {
      const { workoutId, exerciseId, setId } = action.payload;
      return {
        ...state,
        workouts: state.workouts.map(workout => {
          if (workout.id === workoutId) {
            return {
              ...workout,
              exercises: workout.exercises.map(exercise => {
                if (
                  exercise.id === exerciseId ||
                  exercise.tempId === exerciseId
                ) {
                  return {
                    ...exercise,
                    sets: exercise.sets.filter(
                      set => set.id !== setId && set.tempId !== setId
                    )
                  };
                }
                return exercise;
              })
            };
          }
          return workout;
        })
      };
    }

    default:
      return state;
  }
}

export { workoutReducer };
