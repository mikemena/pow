import { v4 as uuidv4 } from 'uuid';
import { actionTypes } from '../actions/actionTypes';
import { initialState } from './initialState';
import exerciseUtils from '../utils/exercise.js';
import { standardizeWorkout } from '../utils/standardizeWorkout';

function workoutReducer(state = initialState.workouts, action) {
  console.log('Action Type:', action.type);
  console.log('State Before:', state);
  console.log('Action Payload:', action.payload);

  switch (action.type) {
    case actionTypes.ADD_WORKOUT:
      console.log('Action Type: ADD_WORKOUT');
      console.log('State Before:', state);
      console.log('Action Payload:', action.payload);

      const newWorkout = standardizeWorkout(action.payload);
      if (!newWorkout) return state;
      console.log('Adding workout in reducer:', newWorkout);
      if (!newWorkout) {
        console.error('Failed to standardize workout:', action.payload);
        return state;
      }
      return {
        ...state,
        [newWorkout.id]: newWorkout
      };

    case actionTypes.UPDATE_WORKOUT:
      console.log('Updating workout in reducer:', action.payload);
      return {
        ...state,
        [action.payload.id]: action.payload
      };

    case actionTypes.ADD_EXERCISE:
      const { workoutId: workoutIdAddEx, exercises } = action.payload;
      const existingWorkout = state[workoutIdAddEx];

      if (!existingWorkout) {
        console.error(`Workout with id ${workoutIdAddEx} not found`);
        return state;
      }

      const updatedExrc = [
        ...existingWorkout.exercises,
        ...exercises.map(ex => exerciseUtils.standardizeExercise(ex))
      ];

      return {
        ...state,
        [workoutIdAddEx]: {
          ...existingWorkout,
          exercises: updatedExrc
        }
      };

    case actionTypes.UPDATE_EXERCISE:
      const { workoutId: wId4, exercise } = action.payload;
      const workout4 = state[wId4];
      if (!workout4) return state;

      const updatedExercises4 = workout4.exercises.map(ex =>
        ex.id === exercise.id ? { ...ex, ...exercise } : ex
      );

      return {
        ...state,
        [wId4]: {
          ...workout4,
          exercises: updatedExercises4
        }
      };

    case actionTypes.REMOVE_EXERCISE:
      const { workoutId: wId5, exerciseId: exId5 } = action.payload;
      const workout5 = state[wId5];
      if (!workout5) return state;

      const remainingExercises = workout5.exercises.filter(
        ex => ex.id !== exId5
      );

      return {
        ...state,
        [wId5]: {
          ...workout5,
          exercises: remainingExercises
        }
      };

    case actionTypes.ADD_SET:
      const {
        workoutId: workoutIdAddSet,
        exerciseId,
        weight,
        reps
      } = action.payload;
      const workoutToUpdate = state[workoutIdAddSet];
      if (!workoutToUpdate) return state;

      return {
        ...state,
        [workoutIdAddSet]: {
          ...workoutToUpdate,
          exercises: workoutToUpdate.exercises.map(exercise =>
            exerciseUtils.getExerciseId(exercise) === exerciseId
              ? {
                  ...exercise,
                  sets: [
                    ...exercise.sets,
                    {
                      id: uuidv4(),
                      weight,
                      reps,
                      order: exercise.sets.length + 1
                    }
                  ]
                }
              : exercise
          )
        }
      };

    case actionTypes.UPDATE_SET:
      const { workoutId: wId2, exerciseId: exId, updatedSet } = action.payload;
      const workout2 = state[wId2];
      if (!workout2) return state;

      const updatedExercises2 = workout2.exercises.map(exercise => {
        if (exercise.id === exId) {
          return {
            ...exercise,
            sets: exercise.sets.map(set =>
              set.id === updatedSet.id ? { ...set, ...updatedSet } : set
            )
          };
        }
        return exercise;
      });

      return {
        ...state,
        [wId2]: {
          ...workout2,
          exercises: updatedExercises2
        }
      };

    case actionTypes.REMOVE_SET:
      const {
        workoutId: workoutIdDeleteSet,
        exerciseId: exerciseIdDeleteSet,
        setId: setIdDeleteSet
      } = action.payload;
      const workoutDeleteSet = state[workoutIdDeleteSet];
      if (!workoutDeleteSet) return state;

      const updatedExercisesDeleteSet = workoutDeleteSet.exercises.map(
        exercise => {
          const exerciseIdToCompare = exerciseUtils.getExerciseId(exercise);
          if (exerciseIdToCompare === exerciseIdDeleteSet) {
            return {
              ...exercise,
              sets: exercise.sets.filter(set => set.id !== setIdDeleteSet)
            };
          }
          return exercise;
        }
      );

      return {
        ...state,
        [workoutIdDeleteSet]: {
          ...workoutDeleteSet,
          exercises: updatedExercisesDeleteSet
        }
      };

    case actionTypes.DELETE_WORKOUT: {
      if (!action.payload) {
        console.error('Invalid payload for DELETE_WORKOUT', action.payload);
        return state;
      }

      const { [action.payload]: deletedWorkout, ...remainingWorkouts } = state;
      const reorderedWorkouts = Object.values(remainingWorkouts)
        .sort((a, b) => a.order - b.order)
        .map((workout, index) => ({
          ...workout,
          order: index + 1
        }))
        .reduce((acc, workout) => {
          acc[workout.id] = workout;
          return acc;
        }, {});

      const newState = {
        ...reorderedWorkouts
      };

      return newState;
    }

    default:
      return state;
  }
}

export { workoutReducer };
