import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Header: React.FC = () => {
  return (
    <View style={styles.header}>
      <Text style={styles.logo}>POW</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: 'black',
    padding: 10,
    paddingTop: 40, // Adjust this value based on the device's status bar height
    alignItems: 'flex-start'
  },
  logo: {
    color: '#FF69B4', // Pink color
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'monospace' // This gives a pixelated look, similar to the image
  }
});

export default Header;
