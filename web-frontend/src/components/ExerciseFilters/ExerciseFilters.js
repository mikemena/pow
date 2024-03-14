import React from 'react';
import styled from 'styled-components';
import useFetchData from '../../hooks/useFetchData';

const FilterContainer = styled.div`
  display: flex;
  width: 585px;
`;

const Filter = styled.div`
  display: flex;
  width: 300px;
  padding-left: 10px;
`;

function ExerciseFilters({ onMuscleChange, onEquipmentChange }) {
  const {
    data: muscles,
    isLoading: isLoadingMuscles,
    error: errorMuscles
  } = useFetchData('http://localhost:9025/api/muscles');

  const {
    data: equipments,
    isLoading: isLoadingEquipments,
    error: errorEquipments
  } = useFetchData('http://localhost:9025/api/equipments');

  // Loading indicator or error message for equipments
  if (isLoadingEquipments) return <div>loading...</div>;
  if (errorEquipments)
    return <div>Error loading equipments: {errorEquipments}</div>;

  // Loading indicator or error message for muscles
  if (isLoadingMuscles) return <div>loading...</div>;
  if (errorMuscles) return <div>Error loading equipments: {errorMuscles}</div>;

  return (
    <FilterContainer>
      <Filter>
        <input
          list='muscles'
          id='muscle-search'
          type='search'
          onChange={event => onMuscleChange(event.target.value)}
          placeholder='Search Muscles'
        />
        <datalist id='muscles'>
          {muscles.map((option, index) => (
            <option key={index} value={option.name} />
          ))}
        </datalist>
      </Filter>

      <Filter>
        <input
          list='equipments'
          id='equipment-search'
          type='search'
          onChange={event => onEquipmentChange(event.target.value)}
          placeholder='Search Equipment'
        />
        <datalist id='equipments'>
          {equipments.map((option, index) => (
            <option key={index} value={option.name} />
          ))}
        </datalist>
      </Filter>
    </FilterContainer>
  );
}

export default ExerciseFilters;
