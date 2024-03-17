import React, { createContext, useState } from 'react';

export const WorkoutContainerContext = createContext();

export const WorkoutContainerProvider = ({ children }) => {
  const [expandedWorkoutId, setExpandedWorkoutId] = useState(1);

  const toggleExpand = workoutId => {
    setExpandedWorkoutId(expandedWorkoutId === workoutId ? null : workoutId);
  };

  const value = { expandedWorkoutId, toggleExpand };

  return (
    <WorkoutContainerContext.Provider value={value}>
      {children}
    </WorkoutContainerContext.Provider>
  );
};
