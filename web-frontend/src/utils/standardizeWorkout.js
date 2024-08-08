export const standardizeWorkout = workout => {
  if (!workout || typeof workout !== 'object') {
    console.error('Invalid workout object:', workout);
    return null;
  }

  return {
    id: workout.id || '',
    name: workout.name || '',
    programId: workout.programId || workout.program_id || '',
    exercises: workout.exercises || [],
    order: workout.order || 1
  };
};
