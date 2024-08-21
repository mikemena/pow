import { v4 as uuidv4 } from 'uuid';
import { standardizeExercise } from './standardizeExercise';

export const standardizeWorkout = workout => {
  if (!workout || typeof workout !== 'object') {
    console.error('Invalid workout object:', workout);
    return null;
  }

  const workoutId = workout.id || uuidv4();

  return {
    id: workoutId,
    name: workout.name || '',
    exercises: (workout.exercises || []).map(standardizeExercise) // Delegate exercise standardization
  };
};
