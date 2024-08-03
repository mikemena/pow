export const standardizeWorkout = workout => {
  return {
    id: workout.id || '',
    name: workout.name || '',
    programId: workout.programId || '',
    exercises: workout.exercises || [],
    order: workout.order || 1
  };
};
