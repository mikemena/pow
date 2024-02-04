import React from 'react';
import { useNavigate } from 'react-router-dom';
import muscles from '../utils/muscles.json';
import MuscleGroup from '../components/MuscleGroup/MuscleGroup';
import './MusclesPage.css';

const MuscleGroupsPage = () => {
  let navigate = useNavigate();

  const navigateToExercises = muscleId => {
    navigate(`/exercises/${muscleId}`);
  };

  return (
    <div className='muscle-groups-container'>
      {muscles.map(group => (
        <MuscleGroup
          key={group.id}
          name={group.name}
          image={group.image} // Pass the image prop to MuscleGroup
          onClick={() => navigateToExercises(group.id)}
        />
      ))}
    </div>
  );
};

export default MuscleGroupsPage;
