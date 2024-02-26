import React, { createContext, useContext, useState } from 'react';

const WorkoutContext = createContext();

export const useWorkout = () => useContext(WorkoutContext);

export const WorkoutProvider = ({ children }) => {
  const [workout, setWorkout] = useState({
    templateName: '',
    planType: 'General',
    dayType: 'Day of Week',
    difficulty: 'Intermediate',
    selectedExercises: []
  });

  return (
    <WorkoutContext.Provider value={{ workout, setWorkout }}>
      {children}
    </WorkoutContext.Provider>
  );
};
