import { v4 as uuidv4 } from 'uuid';

export const standardizeWorkout = workout => {
  if (!workout || typeof workout !== 'object') {
    console.error('Invalid workout object:', workout);
    return null;
  }

  const workoutId = workout.id || uuidv4();

  return {
    id: workoutId,
    name: workout.name || '',
    exercises: (workout.exercises || []).map(exercise => ({
      id: exercise.id || uuidv4(),
      catalog_exercise_id: exercise.catalog_exercise_id || null,
      equipment: exercise.equipment || '',
      muscle: exercise.muscle || '',
      name: exercise.name || '',
      order: exercise.order || 0,
      sets: (exercise.sets || []).map(set => ({
        id: set.id || uuidv4(),
        order: set.order || 0,
        reps: set.reps || 0,
        weight: set.weight || 0,
        unit: set.unit || 'lbs'
      }))
    }))
  };
};
