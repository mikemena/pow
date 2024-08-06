// exercise.js

import { v4 as uuidv4 } from 'uuid'; // Make sure to import uuid if you're using it

const exerciseUtils = {
  getExerciseId: exercise => exercise.tempId || exercise.id,

  standardizeExercise: exercise => ({
    ...exercise,
    sets: exercise.sets || [],
    tempId: exercise.tempId || uuidv4()
  })
};

export default exerciseUtils;

// Using the utility functions

//import exerciseUtils from './exercise.js';
//const exerciseId = exerciseUtils.getExerciseId(someExercise);
//const standardizedExercise = exerciseUtils.standardizeExercise(someExercise);
