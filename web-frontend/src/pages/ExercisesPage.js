import React from 'react';
import MuscleGroup from '../components/MuscleGroup/MuscleGroup';
import './ExercisesPage.css';
import tricepsImage from '../assets/images/muscles/triceps.png';
import bicepsImage from '../assets/images/muscles/biceps.png';
import chestImage from '../assets/images/muscles/chest.png';
import shouldersImage from '../assets/images/muscles/shoulders.png';
import coreImage from '../assets/images/muscles/core.png';
import backImage from '../assets/images/muscles/back.png';
import forearmImage from '../assets/images/muscles/forearms.png';
import upperLegsImage from '../assets/images/muscles/upper_legs.png';
import lowerLegsImage from '../assets/images/muscles/lower_legs.png';
import glutesImage from '../assets/images/muscles/glutes.png';
import cardioImage from '../assets/images/muscles/cardio.png';
import allImage from '../assets/images/muscles/all.png';

const exercisesData = [
  { name: 'Triceps', image: tricepsImage },
  { name: 'Chest', image: chestImage },
  { name: 'Shoulders', image: shouldersImage },
  { name: 'Biceps', image: bicepsImage },
  { name: 'Core', image: coreImage },
  { name: 'Back', image: backImage },
  { name: 'Forearm', image: forearmImage },
  { name: 'Upper Legs', image: upperLegsImage },
  { name: 'Glutes', image: glutesImage },
  { name: 'Cardio', image: cardioImage },
  { name: 'Lower Legs', image: lowerLegsImage },
  { name: 'All Exercises', image: allImage }
  // ... other muscle groups with their images
];

const ExercisesPage = () => {
  return (
    <div className='exercises-grid'>
      {exercisesData.map(muscle => (
        <MuscleGroup
          key={muscle.name}
          name={muscle.name}
          image={muscle.image}
        />
      ))}
    </div>
  );
};

export default ExercisesPage;
