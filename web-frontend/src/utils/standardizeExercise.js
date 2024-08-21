import { v4 as uuidv4 } from 'uuid';

export const standardizeExercise = exercise => {
  if (!exercise || typeof exercise !== 'object') {
    console.error('Invalid exercise object:', exercise);
    return null;
  }

  const exerciseId = exercise.id || uuidv4();

  return {
    id: exerciseId,
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
  };
};
