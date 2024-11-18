import React, { useEffect } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import SwipeableItemDeletion from '../components/SwipeableItemDeletion';

const Set = ({ index, set, isLast, onSetChange, onDelete, themedStyles }) => {
  //log isLast in useEffect
  useEffect(() => {
    console.log(isLast);
  }, [isLast]);

  return (
    <View style={styles.setRowWrapper}>
      <SwipeableItemDeletion onDelete={() => onDelete(set.id)}>
        <View
          style={[
            styles.setRow,
            { backgroundColor: themedStyles.secondaryBackgroundColor },
            isLast && styles.lastSetRow
          ]}
        >
          <Text style={[styles.setNumber, { color: themedStyles.textColor }]}>
            {index + 1}
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: themedStyles.primaryBackgroundColor,
                color: themedStyles.textColor
              }
            ]}
            value={set.weight?.toString()}
            onChangeText={value => onSetChange(index, 'weight', value)}
            keyboardType='numeric'
          />
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: themedStyles.primaryBackgroundColor,
                color: themedStyles.textColor
              }
            ]}
            value={set.reps?.toString()}
            onChangeText={value => onSetChange(index, 'reps', value)}
            keyboardType='numeric'
          />
        </View>
      </SwipeableItemDeletion>
    </View>
  );
};

// Update the existing styles with new ones for the slide-to-delete functionality
const styles = StyleSheet.create({
  setRowWrapper: {
    position: 'relative',
    overflow: 'hidden'
  },
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    height: 40
  },

  setNumber: {
    width: 40,
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'Lexend'
  },
  input: {
    flex: 1,
    height: 35,
    marginHorizontal: 8,
    borderRadius: 10,
    textAlign: 'center',
    fontFamily: 'Lexend'
  }
});

export default Set;
