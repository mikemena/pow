import { useNavigate } from 'react-router-dom';
import Nav from '../../../components/Nav/Nav';
import './templateDetails.css';

const TemplateDetails = (
  templateName,
  dayType,
  planType,
  difficulty,
  exercises
) => {
  const navigate = useNavigate();

  const handleSaveTemplate = async event => {
    event.preventDefault();

    const templateData = {
      user_id: 2, // hardcoded for now, but should be the logged in user's ID
      workout_name: templateName,
      workout_day_type: dayType,
      plan_type: planType,
      difficulty_level: difficulty,
      exercises: Array.from(exercises).map(exerciseId => ({
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
    navigate(-1);
  };

  return (
    <div className='page-layout'>
      <Nav />
      <h1 className='page-title'>Create New Template</h1>
      <form onSubmit={handleSaveTemplate}>
        <div className='template-details'>
          {Array.from(exercises).map(exerciseId => {
            const exercise = exercises.find(
              ex => ex.exercise_id === exerciseId
            );
            return (
              <div key={exerciseId} className='exercise-entry'>
                <div className='exercise-header'>
                  <img
                    src={`http://localhost:9025/${exercise.file_path}`}
                    alt={exercise.name}
                  />
                  <h3>{exercise.name}</h3>
                </div>
                <div className='sets-reps-container'>
                  {/* Repeat this part for the number of sets */}
                  <div className='set-entry'>
                    <label>SET</label>
                    <input type='number' defaultValue={1} min={1} />
                    <label>LBS</label>
                    <input type='number' defaultValue={10} min={0} />
                    <label>REPS</label>
                    <input type='number' defaultValue={8} min={1} />
                    <button type='button'>+</button> {/* Increment set */}
                    <button type='button'>Delete</button> {/* Remove set */}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

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
