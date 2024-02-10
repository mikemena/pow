import React, { useState, useEffect } from 'react';
import MuscleGroup from '../components/MuscleGroup/MuscleGroup';
import './MusclesPage.css';
import { useNavigate } from 'react-router-dom';

const MusclesPage = () => {
  const [muscles, setMuscles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMuscles = async () => {
      try {
        const response = await fetch('http://localhost:9025/api/muscles');
        const data = await response.json();
        setMuscles(data);
      } catch (error) {
        console.error('Failed to fetch muscles:', error);
      }
    };

    fetchMuscles();
  }, []);

  // Function to handle click even on a muscle group
  const handleMuscleClick = muscle => {
    // navigate(`/exercises/${muscleId}`);
    navigate('/exercises', {
      state: { selectedMuscle: muscle.name }
    });
  };

  return (
    <div className='muscle-page'>
      <div className='muscle-container'>
        {muscles.map(muscle => (
          <MuscleGroup
            key={muscle.muscle_group_id}
            name={muscle.name}
            image={`http://localhost:9025/${muscle.file_path}`}
            onClick={() => handleMuscleClick(muscle.muscle_group_id)}
          />
        ))}
      </div>
    </div>
  );
};

export default MusclesPage;
