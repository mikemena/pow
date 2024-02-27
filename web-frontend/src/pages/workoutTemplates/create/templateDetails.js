import { useNavigate } from 'react-router-dom';
import { useWorkout } from '../../../contexts/workoutContext';
import Nav from '../../../components/Nav/Nav';
import './templateDetails.css';

const TemplateDetails = () => {
  const { workout } = useWorkout();
  const navigate = useNavigate();

  const handleSaveTemplate = async event => {
    event.preventDefault();

    const templateData = {
      user_id: 2, // hardcoded for now, but should be the logged in user's ID
      workout_name: workout.templateName,
      workout_day_type: workout.dayType,
      plan_type: workout.planType,
      difficulty_level: workout.difficulty,
      exercises: Array.from(workout.selectedExercises).map(exerciseId => ({
        exercise_id: exerciseId
      }))
    };

    try {
      const response = await fetch(
        'http://localhost:9025/api/workout-templates',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(templateData)
        }
      );

      if (!response.ok) {
        throw new Error('Something went wrong with saving the template');
      }

      // Assuming the backend responds with the created template, you could use it here if needed
      // const savedTemplate = await response.json();

      // After saving, redirect back to the WorkoutPage
      navigate('/workouts');
    } catch (error) {
      console.error('Failed to save the template:', error);
      // Here, you could set an error state and display it to the user if you wish
    }
  };

  const handleCancel = () => {
    // Redirect to the create workout page
    navigate('/workouts');
  };

  const handleGoBack = () => {
    // Redirect to the previous page
    navigate('/create-workout');
  };

  return (
    <div className='page-layout'>
      <Nav />
      <h1 className='page-title'>Add Workout Details</h1>
      <form onSubmit={handleSaveTemplate}>
        {workout.selectedExercises
          .filter(exercise => exercise.exercise_id && exercise.name)
          .map(exercise => (
            <div key={exercise.exercise_id} className='template-detail'>
              <div className='template-detail-header'>
                <img
                  src={`http://localhost:9025/${exercise.file_path}`}
                  alt={exercise.name}
                  className='template-detail-image'
                />
                <h3 className='template-detail-title'>{exercise.name}</h3>
              </div>
              <div className='template-detail-field-container'>
                <label>Set</label>
                <input type='number' defaultValue={1} min={1} />
                <label>Lbs</label>
                <input type='number' defaultValue={10} min={0} />
                <label>Reps</label>
                <input type='number' defaultValue={8} min={1} />
                <button type='button' className='template-detail-add-button'>
                  +
                </button>
                <button type='button' className='template-detail-remove-button'>
                  -
                </button>
              </div>
            </div>
          ))}

        <div className='button-container'>
          <button id='back-button' onClick={handleGoBack}>
            Go Back
          </button>
          <button id='save-workout-button' onClick={handleSaveTemplate}>
            Save Workout
          </button>
          <button id='cancel-workout-button' onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default TemplateDetails;
