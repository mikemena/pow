import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { IoChevronBackOutline } from 'react-icons/io5';
import Button from '../../../components/Inputs/Button';
import NavBar from '../../../components/Nav/Nav';
import { useTheme } from '../../../contexts/themeContext';
import './program.css';

const ProgramDetailsPage = () => {
  const { program_id } = useParams();
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { theme } = useTheme();

  useEffect(() => {
    const fetchProgramDetails = async () => {
      try {
        console.log(`Fetching program details for ID: ${program_id}`);
        const response = await fetch(
          `http://localhost:9025/api/programs/${program_id}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Program details fetched:', data);
        setProgram(data);
      } catch (err) {
        console.error('Error fetching program details:', err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProgramDetails();
  }, [program_id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <NavBar />
      <div className='prog-details-page'>
        <Link
          className={`prog-details-page__title-link ${theme}`}
          to='/programs'
        >
          <IoChevronBackOutline className='prog-details-page__back-icon' />
          <span className='prog-details-page__back-text'>Back</span>
        </Link>
      </div>
      <div>
        <h1>{program.name}</h1>
        <p>Main Goal: {program.main_goal}</p>
        <p>
          Duration: {program.program_duration} {program.duration_unit}
        </p>
        <p>Days Per Week: {program.days_per_week}</p>
        {/* Display workouts, exercises, and sets here */}
        {program.workouts.map(workout => (
          <div key={workout.id}>
            <h2>{workout.name}</h2>
            {workout.exercises.map(exercise => (
              <div key={exercise.id}>
                <h3>{exercise.exercise_name}</h3>
                {exercise.sets.map(set => (
                  <div key={set.id}>
                    <p>
                      Set {set.order}: {set.reps} reps at {set.weight} lbs
                    </p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className='view-prog-page__program-list'>{program.id}</div>
      <div className='prog-details-page__button-container'>
        <Button type='button' onClick={console.log('edit program')}>
          Edit
        </Button>
        <Button type='submit' onClick={console.log('delete program')}>
          Delete
        </Button>
      </div>
    </div>
  );
};

export default ProgramDetailsPage;
