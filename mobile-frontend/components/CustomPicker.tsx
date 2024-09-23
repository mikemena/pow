import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { colors } from '../src/styles/globalStyles';
import { useTheme } from '../src/hooks/useTheme';
import { getThemedStyles } from '../src/utils/themeUtils';

interface PickerOption {
  label: string;
  value: string;
}

interface CustomPickerProps {
  options: PickerOption[];
  selectedValue: string;
  onValueChange: (value: string) => void;
  label: string;
}

const CustomPicker: React.FC<CustomPickerProps> = ({
  options,
  selectedValue,
  onValueChange,
  label
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const { state } = useTheme();
  const themedStyles = getThemedStyles(state.theme, state.accentColor);

  return (
    <View style={styles.pickerContainer}>
      <TouchableOpacity
        style={[
          styles.pickerButton,
          { backgroundColor: themedStyles.secondaryBackgroundColor }
        ]}
        onPress={() => setModalVisible(true)}
      >
        <Text style={[styles.pickerButtonText, { color: colors.eggShell }]}>
          {options.find(option => option.value === selectedValue)?.label}
        </Text>
      </TouchableOpacity>
      <Modal
        visible={modalVisible}
        animationType='slide'
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              { backgroundColor: themedStyles.secondaryBackgroundColor }
            ]}
          >
            {options.map(option => (
              <TouchableOpacity
                key={option.value}
                style={styles.optionButton}
                onPress={() => {
                  onValueChange(option.value);
                  setModalVisible(false);
                }}
              >
                <Text style={styles.optionText}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  pickerContainer: {
    flex: 1,
    marginHorizontal: 4
  },
  pickerButton: {
    padding: 10,
    borderRadius: 8,
    alignItems: 'center'
  },
  pickerButtonText: {
    fontSize: 14
  },
  label: {
    fontSize: 16,
    marginBottom: 8
  },

  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  modalContent: {
    padding: 20,
    borderRadius: 10,
    width: '80%'
  },
  optionButton: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  optionText: {
    fontSize: 16
  }
});

export default CustomPicker;
