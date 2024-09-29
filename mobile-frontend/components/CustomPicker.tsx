import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback
} from 'react-native';
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
  placeholder?: string;
}

const CustomPicker: React.FC<CustomPickerProps> = ({
  options,
  selectedValue,
  onValueChange,
  placeholder = 'Select an option'
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const { state } = useTheme();
  const themedStyles = getThemedStyles(state.theme, state.accentColor);

  const selectedOption = options.find(option => option.value === selectedValue);
  const displayText = selectedOption ? selectedOption.label : placeholder;

  return (
    <View style={styles.pickerContainer}>
      <TouchableOpacity
        style={[
          styles.pickerButton,
          { backgroundColor: themedStyles.secondaryBackgroundColor }
        ]}
        onPress={() => setModalVisible(true)}
      >
        <Text
          style={[styles.pickerButtonText, { color: themedStyles.textColor }]}
        >
          {displayText}
        </Text>
      </TouchableOpacity>
      <Modal
        visible={modalVisible}
        animationType='fade'
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View
                style={[
                  styles.modalContent,
                  { backgroundColor: themedStyles.secondaryBackgroundColor }
                ]}
              >
                {options.map((option, index) => (
                  <TouchableOpacity
                    key={`${option.value}-${index}`}
                    style={[
                      styles.optionButton,
                      { borderBottomColor: themedStyles.primaryBackgroundColor }
                    ]}
                    onPress={() => {
                      onValueChange(option.value);
                      setModalVisible(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        { color: themedStyles.textColor }
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  pickerContainer: {
    flex: 1,
    marginBottom: 20
  },
  pickerButton: {
    height: 50,
    borderRadius: 30,
    paddingHorizontal: 15,
    justifyContent: 'center'
  },
  pickerButtonText: {
    fontSize: 16
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
    width: '80%',
    maxHeight: '80%'
  },
  optionButton: {
    padding: 10,
    borderBottomWidth: 1
  },
  optionText: {
    fontSize: 16
  }
});

export default CustomPicker;
