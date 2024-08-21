export const standardizeWorkout = workout => {
  if (!workout || typeof workout !== 'object') {
    console.error('Invalid workout object:', workout);
    return null;
  }

  return {
    id: workout.id || null,
    tempId: workout.tempId || null,
    name: workout.name || '',
    active: workout.active || false,
    order: workout.order || 1,
    exercises: workout.exercises || []
  };
};
