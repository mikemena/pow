import React from 'react';
import WorkoutTemplateItem from './TemplateItem';
import './TemplateGrid.css';

const WorkoutTemplateGrid = ({ templates }) => {
  return (
    <div id='workout-grid'>
      {templates.map(template => (
        <WorkoutTemplateItem
          key={template.workout_id}
          name={template.workout_name}
          day_type={template.workout_day_type}
          plan_type={template.plan_type}
          difficulty_level={template.difficulty_level}
        />
      ))}
    </div>
  );
};

export default WorkoutTemplateGrid;
