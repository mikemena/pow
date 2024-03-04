import React, { useState } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import './DayContainer.css';

const DayContainer = ({ day, onAddExercise }) => {
  const [exercises, setExercises] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <Droppable droppableId={day}>
      {provided => (
        <div {...provided.droppableProps} ref={provided.innerRef}>
          {exercises.map((exercise, index) => (
            <Draggable
              key={exercise.id}
              draggableId={exercise.id}
              index={index}
            >
              {provided => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                >
                  {/* Exercise content here */}
                </div>
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

export default DayContainer;
