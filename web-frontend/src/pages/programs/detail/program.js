import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { IoChevronBackOutline } from 'react-icons/io5';
import { BsChevronCompactUp, BsChevronCompactDown } from 'react-icons/bs';
import Button from '../../../components/Inputs/Button';
import NavBar from '../../../components/Nav/Nav';
import { useTheme } from '../../../contexts/themeContext';
import { toProperCase } from '../../../utils/stringUtils';
import './program.css';

const ProgramDetailsPage = () => {
  const { program_id } = useParams();
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedWorkouts, setExpandedWorkouts] = useState({});

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

  const handleExpand = workoutId => {
    setExpandedWorkouts(prev => ({
      ...prev,
      [workoutId]: !prev[workoutId]
    }));
  };

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
        <div className={`prog-details-page__program ${theme}`}>
          <h2 className='prog-details-page__program-title'>{program.name}</h2>
          <div className='prog-details-page__program-details'>
            <div className='prog-details-page__program-details-section'>
              <p className='prog-details-page__program-details-label'>
                Main Goal
              </p>
              <p className='prog-details-page__program-details-value'>
                {toProperCase(program.main_goal)}
              </p>
            </div>
            <div className='prog-details-page__program-details-section'>
              <p className='prog-details-page__program-details-label'>
                Duration
              </p>
              <p className='prog-details-page__program-details-value'>
                {program.program_duration} {toProperCase(program.duration_unit)}
              </p>
            </div>
            <div className='prog-details-page__program-details-section'>
              <p className='prog-details-page__program-details-label'>
                Days Per Week
              </p>
              <p className='prog-details-page__program-details-value'>
                {program.days_per_week}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div>
        {/* Display workouts, exercises, and sets here */}
        {program.workouts.map(workout => (
          <div
            key={workout.id}
            className={`prog-details-page__workout-container ${theme}`}
          >
            <div className='prog-details-page__workout-header'>
              <div className='prog-details-page__workout-expand-container'>
                <button
                  className='prog-details-page__workout-expand-btn'
                  onClick={() => handleExpand(workout.id)}
                >
                  {expandedWorkouts[workout.id] ? (
                    <BsChevronCompactUp
                      className={`workout__icon ${theme}`}
                      size={30}
                    />
                  ) : (
                    <BsChevronCompactDown
                      className={`workout__icon ${theme}`}
                      size={30}
                    />
                  )}
                </button>
              </div>
              <h1>{workout.name}</h1>
              <h2>{workout.id}</h2>
            </div>
            {expandedWorkouts[workout.id] && (
              <div className='prog-details-page__exercise-container'>
                <div>
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
              </div>
            )}
          </div>
        ))}
      </div>
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
