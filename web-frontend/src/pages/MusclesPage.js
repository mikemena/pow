import React, { useState, useEffect } from 'react';
import './MusclesPage.css';

const MusclesPage = () => {
  const [muscles, setMuscles] = useState([]);

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

  return (
    <div>
      {muscles.map(muscle => (
        <div key={muscle.muscle_group_id}>
          <h3>{muscle.muscle_group_name}</h3>
          <img
            src={`http://localhost:9025/${muscle.file_path}`}
            alt={muscle.muscle_group_name}
          />
        </div>
      ))}
    </div>
  );
};

export default MusclesPage;
