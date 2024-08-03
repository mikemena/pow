export const standardizeWorkout = workout => {
  return {
    id: workout.id || '',
    name: workout.name || '',
    programId: workout.programId || '',
    exercises: workout.exercises || [], // Ensure exercises is always an array
    order: workout.order || 1
  };
};
