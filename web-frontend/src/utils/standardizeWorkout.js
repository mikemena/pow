import { v4 as uuidv4 } from 'uuid';
import { standardizeExercise } from './standardizeExercise';

export const standardizeWorkout = (workout, existingWorkoutsCount = 0) => {
  if (!workout || typeof workout !== 'object') {
    console.error('Invalid workout object:', workout);
    return null;
  }

  const workoutId = workout.id || uuidv4();
  const workoutNumber = existingWorkoutsCount + 1;

  return {
    id: workoutId,
    programId: workout.programId,
    name: workout.name || `Workout ${workoutNumber}`,
    exercises: (workout.exercises || []).map(standardizeExercise)
  };
};
