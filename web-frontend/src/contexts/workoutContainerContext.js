import React, { createContext, useState } from 'react';

export const WorkoutContainerContext = createContext();

export const WorkoutContainerProvider = ({ children }) => {
  const [expandedWorkoutId, setExpandedWorkoutId] = useState(1);

  const toggleExpand = workoutId => {
    console.log(`Before toggling, expandedWorkoutId is: ${expandedWorkoutId}`);
    console.log(`Received workoutId to toggle: ${workoutId}`);
    setExpandedWorkoutId(expandedWorkoutId === workoutId ? null : workoutId);
    console.log(
      `After toggling, expandedWorkoutId is set to: ${
        expandedWorkoutId === workoutId ? null : workoutId
      }`
    );
  };

  const value = { expandedWorkoutId, toggleExpand };

  return (
    <WorkoutContainerContext.Provider value={value}>
      {children}
    </WorkoutContainerContext.Provider>
  );
};
