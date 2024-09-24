import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Exercise = ({ exercise, index, themedStyles }) => {
  return (
    <View
      style={[
        styles.exerciseContainer,
        { backgroundColor: themedStyles.secondaryBackgroundColor }
      ]}
    >
      <View style={styles.exerciseInfo}>
        <Text style={[styles.exerciseIndex, { color: themedStyles.textColor }]}>
          {index}
        </Text>
        <View>
          <Text
            style={[styles.exerciseName, { color: themedStyles.accentColor }]}
          >
            {exercise.name}
          </Text>
          <Text
            style={[styles.exerciseMuscle, { color: themedStyles.textColor }]}
          >
            {exercise.muscle}
          </Text>
        </View>
      </View>
      <View
        style={[
          styles.exerciseHeader,
          { backgroundColor: themedStyles.secondaryBackgroundColor }
        ]}
      >
        <Text style={[styles.headerText, { color: themedStyles.textColor }]}>
          Set
        </Text>
        <Text style={[styles.headerText, { color: themedStyles.textColor }]}>
          Weight
        </Text>
        <Text style={[styles.headerText, { color: themedStyles.textColor }]}>
          Reps
        </Text>
      </View>
      {exercise.sets.map((set, setIndex) => (
        <View key={setIndex} style={styles.setInfo}>
          <Text style={[styles.setText, { color: themedStyles.textColor }]}>
            {set.order}
          </Text>
          <Text style={[styles.setText, { color: themedStyles.textColor }]}>
            {set.weight}
          </Text>
          <Text style={[styles.setText, { color: themedStyles.textColor }]}>
            {set.reps}
          </Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  exerciseContainer: {
    marginTop: 1,
    overflow: 'hidden'
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8
  },
  headerText: {
    fontFamily: 'Lexend-Bold',
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
    textAlign: 'center'
  },
  exerciseInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10
  },
  exerciseIndex: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 12
  },
  exerciseName: {
    fontFamily: 'Lexend',
    fontSize: 16
  },
  exerciseMuscle: {
    fontSize: 16
  },
  setInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingHorizontal: 12
  },
  setText: {
    fontFamily: 'Lexend',
    fontSize: 16,
    flex: 1,
    textAlign: 'center'
  }
});

export default Exercise;
