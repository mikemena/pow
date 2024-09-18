import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ProgramsPage: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text>Program</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2A2A2A',
    color: '#DBD7D5'
  }
});

export default ProgramsPage;
