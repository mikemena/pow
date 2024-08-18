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
    // Workout Reducers

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
        [action.payload.id]: {
          ...state[action.payload.id],
          ...action.payload
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

    // Exercise Reducers

    case actionTypes.ADD_EXERCISE:
      const { workoutId: workoutIdAddEx, exercises } = action.payload;
      const existingWorkout = state[workoutIdAddEx];

      if (!existingWorkout) {
        console.error(`Workout with id ${workoutIdAddEx} not found`);
        return state;
      }

      // Create a Set of existing exercise IDs
      const existingExerciseIds = new Set(
        existingWorkout.exercises.map(ex => ex.id)
      );

      console.log('Set of Existing Exercise IDs:', existingExerciseIds);

      // Filter out duplicates and add only new exercises
      const newExercises = exercises.filter(
        ex => !existingExerciseIds.has(ex.id)
      );

      console.log('New Exercises:', newExercises);

      // Combine existing exercises with new ones
      const updatedExercisesAfterAdd = [
        ...existingWorkout.exercises,
        ...newExercises.map(ex => exerciseUtils.standardizeExercise(ex))
      ];

      console.log('Updated Exercises After Add:', updatedExercisesAfterAdd);

      return {
        ...state,
        [workoutIdAddEx]: {
          ...existingWorkout,
          exercises: updatedExercisesAfterAdd
        }
      };

    case actionTypes.TOGGLE_EXERCISE_SELECTION:
      const { exerciseIdForToggle, exerciseData } = action.payload;
      console.log('Toggling exercise:', exerciseIdForToggle);
      console.log('Current exercises:', state.exercises);

      const existingExerciseIndex = state.exercises.findIndex(
        ex => ex.id === exerciseIdForToggle || ex.tempId === exerciseIdForToggle
      );

      let updatedState;
      if (existingExerciseIndex === -1) {
        // Exercise doesn't exist, add it
        updatedState = {
          ...state,
          exercises: [
            ...state.exercises,
            {
              id: exerciseIdForToggle,
              name: exerciseData.name,
              muscle: exerciseData.muscle,
              equipment: exerciseData.equipment,
              order: state.exercises.length + 1,
              selected: true,
              sets: [
                {
                  id: uuidv4(),
                  weight: 10, // Default weight
                  reps: 10, // Default reps
                  order: 1
                }
              ]
            }
          ]
        };
      } else {
        // Exercise exists, toggle its selection
        const updatedExercises = state.exercises.filter(
          (ex, index) => index !== existingExerciseIndex
        );
        updatedState = {
          ...state,
          exercises: updatedExercises
        };
      }

      console.log('Updated state:', updatedState);
      return updatedState;

    case actionTypes.REMOVE_EXERCISE:
      const { workoutId: wId5, exerciseId: exId5 } = action.payload;
      const workout5 = state[wId5];
      if (!workout5) return state;

      const updatedExercisesAfterRemove = workout5.exercises.filter(
        exercise =>
          exercise.id !== exId5 &&
          exercise.tempId !== exId5 &&
          exercise.catalog_exercise_id !== exId5
      );

      return {
        ...state,
        [wId5]: {
          ...workout5,
          exercises: updatedExercisesAfterRemove
        }
      };

    // Set Reducers

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

      const updatedExercisesAfterSetUpdate = workout2.exercises.map(
        exercise => {
          if (exercise.id === exId) {
            return {
              ...exercise,
              sets: exercise.sets.map(set =>
                set.id === updatedSet.id ? { ...set, ...updatedSet } : set
              )
            };
          }
          return exercise;
        }
      );

      return {
        ...state,
        [wId2]: {
          ...workout2,
          exercises: updatedExercisesAfterSetUpdate
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

    default:
      return state;
  }
}

export { workoutReducer };
