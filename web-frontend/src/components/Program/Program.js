import './Program.css';

const Program = ({
  onDelete,
  onEdit,
  program_id,
  name,
  day_type,
  main_goal,
  days_per_week,
  program_duration,
  workouts
}) => {
  return (
    <div className='program-container'>
      <div className='lines'></div>
      <div program_id={program_id} key={program_id} className='program'>
        <div className='program-title'>
          <h2 className='program-title-text'>{name}</h2>
        </div>
        <div className='program-section'>
          <div className='program-section-content'>
            <p className='program-section-title'>Main Goal</p>
            <p className='program-section-text'>{main_goal}</p>
          </div>
        </div>
        <div className='program-section'>
          <div className='program-section-content'>
            <p className='program-section-title'>Program Duration</p>
            <p className='program-section-text'>{program_duration}</p>
          </div>
        </div>
        <div className='program-section'>
          <div className='program-section-content'>
            <p className='program-section-title'>Days Per Week</p>
            <p className='program-section-text'>{days_per_week}</p>
          </div>
        </div>
        <div className='program-section'>
          <div className='program-section-content'>
            <p className='program-section-title'>Workouts</p>
          </div>
          <p className='program-section-text'>
            {workouts
              .filter(workout => workout.exercises.exercise_name)
              .map(workout => workout.exercises.exercise_name)
              .join(', ')}
          </p>
        </div>
        <div className='workout-template-actions-container'>
          <div className='btn' onClick={() => console.log('Start Workout')}>
            Start
          </div>
          <div
            className='btn'
            onClick={() => {
              const workout = {
                name,
                day_type
              };

              onEdit(workout);
            }}
          >
            Edit
          </div>
          <div
            className='btn'
            onClick={() => {
              onDelete(program_id);
            }}
          >
            Delete
          </div>
        </div>
      </div>
    </div>
  );
};

export default Program;
