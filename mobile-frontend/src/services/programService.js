import { apiService } from './api';

export const programService = {
  async createProgram(programData) {
    try {
      if (!programData || !programData.workouts) {
        throw new Error('Invalid program data structure');
      }

      // Log the incoming exercise data
      console.log(
        'Raw exercise data:',
        JSON.stringify(programData.workouts[0].exercises[0], null, 2)
      );

      const validatedData = {
        userId: programData.userId,
        name: programData.name,
        programDuration: Number(programData.programDuration) || 0,
        daysPerWeek: Number(programData.daysPerWeek) || 0,
        mainGoal: (programData.mainGoal || 'general').toLowerCase(),
        durationUnit: programData.durationUnit,

        workouts: programData.workouts.map((workout, workoutIndex) => ({
          name: workout.name,
          order: workoutIndex + 1,
          exercises: (workout.exercises || []).map((exercise, index) => {
            // First, try to get the catalog ID from various possible sources
            const catalogId =
              exercise.catalogExerciseId ||
              exercise.catalogExerciseId ||
              exercise.id; // As a last resort

            // Log what we found
            console.log('Exercise catalog ID sources:', {
              catalogExerciseId: exercise.catalogExerciseId,
              catalogExerciseId: exercise.catalogExerciseId,
              id: exercise.id,
              chosen: catalogId
            });

            return {
              catalogExerciseId: Number(catalogId), // Ensure it's a number
              order: index + 1,
              sets: (exercise.sets || []).map((set, setIndex) => ({
                order: setIndex + 1,
                weight: set.weight === '' ? null : Number(set.weight),
                reps: set.reps === '' ? null : Number(set.reps)
              }))
            };
          })
        }))
      };

      // Log the final transformed data
      console.log(
        'Transformed exercise data:',
        JSON.stringify(validatedData.workouts[0].exercises[0], null, 2)
      );

      const response = await apiService.createProgram(validatedData);
      return response;
    } catch (error) {
      const enhancedError = new Error(
        `Failed to create program: ${error.message}`
      );
      enhancedError.originalError = error;
      throw enhancedError;
    }
  },
  // Delete method
  async deleteProgram(programId) {
    try {
      // Validate programId format and type
      if (!programId) {
        throw new Error('Program ID is required for deletion');
      }

      // Ensure programId is the correct type (number)
      const parsedId = parseInt(programId, 10);
      if (isNaN(parsedId)) {
        throw new Error(
          `Invalid program ID format: ${programId}. Expected a number.`
        );
      }

      // Log the validated program ID
      console.log('Validated program ID for deletion:', parsedId);

      const response = await apiService.deleteProgram(parsedId);
      return response;
    } catch (error) {
      // Enhanced error logging
      console.error('Program deletion error details:', {
        originalError: error,
        programId,
        timestamp: new Date().toISOString()
      });

      // Rethrow with more context
      throw new Error(`Failed to delete program: ${error.message}`);
    }
  }
};
