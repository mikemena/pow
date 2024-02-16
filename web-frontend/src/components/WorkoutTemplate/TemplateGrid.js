import React from 'react';
import TemplateItems from './TemplateItem';
import './TemplateGrid.css';

const WorkoutTemplateGrid = ({ templates, onDelete }) => {
  return (
    <div id='workout-grid'>
      {templates.map(template => (
        <TemplateItems
          workout_id={template.workout_id}
          key={template.workout_id}
          name={template.workout_name}
          day_type={template.workout_day_type}
          plan_type={template.plan_type}
          difficulty_level={template.difficulty_level}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default WorkoutTemplateGrid;
