import React, { createContext, useState } from 'react';

export const DayContainerContext = createContext();

export const DayContainerProvider = ({ children }) => {
  const [expandedDayId, setExpandedDayId] = useState(1);

  const toggleExpand = dayId => {
    setExpandedDayId(expandedDayId === dayId ? null : dayId);
  };

  const value = { expandedDayId, toggleExpand };

  return (
    <DayContainerContext.Provider value={value}>
      {children}
    </DayContainerContext.Provider>
  );
};
