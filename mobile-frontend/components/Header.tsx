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
    color: '#D93B56',
    fontSize: 36,
    fontWeight: 'bold',
    fontFamily: 'Tiny5'
  }
});

export default Header;
