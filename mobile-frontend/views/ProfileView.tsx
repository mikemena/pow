import React, { useState } from 'react';
import { RouteProp } from '@react-navigation/native';
import Header from '../components/Header';
import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Switch,
  StyleSheet
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme } from '../src/hooks/useTheme';
import { getThemedStyles } from '../src/utils/themeUtils';
import { globalStyles, colors } from '../src/styles/globalStyles';

type RootStackParamList = {
  Profile: {
    initialUserName?: string;
    initialEmail?: string;
    initialDarkMode?: boolean;
    initialAccentColor?: string;
    onSave?: (data: any) => void;
  };
};

type ProfileScreenRouteProp = RouteProp<RootStackParamList, 'Profile'>;

interface ProfileViewProps {
  route?: ProfileScreenRouteProp;
}

const ProfileView: React.FC<ProfileViewProps> = ({ route }) => {
  const {
    initialUserName = '',
    initialEmail = '',
    initialDarkMode = false,
    initialAccentColor = '',
    onSave = (data: any) => console.log('Saving profile data:', data)
  } = route?.params || {};

  const [userName, setUserName] = useState(initialUserName);
  const [email, setEmail] = useState(initialEmail);
  const [isEditing, setIsEditing] = useState(false);
  const [isProfileExpanded, setIsProfileExpanded] = useState(false);
  const [isSettingsExpanded, setIsSettingsExpanded] = useState(false);
  const [darkMode, setDarkMode] = useState(initialDarkMode);
  const [accentColor, setAccentColor] = useState(initialAccentColor);
  const { state, dispatch } = useTheme();
  const themedStyles = getThemedStyles(state.theme, state.accentColor);

  const accentColors = ['#F99C57', '#A6E221', '#D93B56', '#3F75DF', '#FC63D2'];

  const handleSave = () => {
    onSave({ userName, email });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setUserName(initialUserName);
    setEmail(initialEmail);
    setIsEditing(false);
  };

  const handleDarkModeToggle = (value: boolean) => {
    setDarkMode(value);
    dispatch({ type: 'SET_THEME', payload: value ? 'dark' : 'light' });
  };

  const handleAccentColorChange = (newColor: string) => {
    dispatch({ type: 'SET_ACCENT_COLOR', payload: newColor });
  };

  const handleSectionToggle = (section: 'profile' | 'settings') => {
    if (section === 'profile') {
      setIsProfileExpanded(!isProfileExpanded);
      setIsSettingsExpanded(false);
    } else {
      setIsSettingsExpanded(!isSettingsExpanded);
      setIsProfileExpanded(false);
    }
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        // globalStyles.container,
        { backgroundColor: themedStyles.primaryBackgroundColor }
      ]}
    >
      <Header pageName='Profile' />

      {/* profile details section */}
      <View style={globalStyles.container}>
        <View
          style={[
            globalStyles.section,
            { backgroundColor: themedStyles.secondaryBackgroundColor }
          ]}
        >
          <TouchableOpacity
            // onPress={() => setIsProfileExpanded(!isProfileExpanded)}
            onPress={() => handleSectionToggle('profile')}
          >
            <View
              style={[
                globalStyles.sectionHeader,
                { backgroundColor: themedStyles.secondaryBackgroundColor }
              ]}
            >
              <Ionicons
                name='person-outline'
                style={[globalStyles.icon, { color: themedStyles.textColor }]}
              />

              <Text
                style={[
                  globalStyles.sectionTitle,
                  { color: themedStyles.textColor }
                ]}
              >
                Profile Details
              </Text>
              <Ionicons
                name={
                  isProfileExpanded
                    ? 'chevron-up-outline'
                    : 'chevron-down-outline'
                }
                style={[globalStyles.icon, { color: themedStyles.textColor }]}
              />
            </View>
          </TouchableOpacity>

          {isProfileExpanded && (
            <View
              style={[
                globalStyles.sectionContent,
                { backgroundColor: themedStyles.secondaryBackgroundColor }
              ]}
            >
              <Text
                style={[globalStyles.label, { color: themedStyles.textColor }]}
              >
                User Name
              </Text>
              <TextInput
                style={[
                  globalStyles.input,
                  { backgroundColor: themedStyles.primaryBackgroundColor }
                ]}
                value={userName}
                onChangeText={setUserName}
                editable={isEditing}
              />
              <Text
                style={[globalStyles.label, { color: themedStyles.textColor }]}
              >
                Email
              </Text>
              <TextInput
                style={[
                  globalStyles.input,
                  { backgroundColor: themedStyles.primaryBackgroundColor }
                ]}
                value={email}
                onChangeText={setEmail}
                editable={isEditing}
                keyboardType='email-address'
              />
            </View>
          )}
        </View>

        {/* settings section */}
        <View
          style={[
            globalStyles.section,
            { backgroundColor: themedStyles.secondaryBackgroundColor }
          ]}
        >
          <TouchableOpacity
            // onPress={() => setIsSettingsExpanded(!isSettingsExpanded)}
            onPress={() => handleSectionToggle('settings')}
          >
            <View
              style={[
                globalStyles.sectionHeader,
                { backgroundColor: themedStyles.secondaryBackgroundColor }
              ]}
            >
              <Ionicons
                name='settings-outline'
                style={[globalStyles.icon, { color: themedStyles.textColor }]}
              />

              <Text
                style={[
                  globalStyles.sectionTitle,
                  { color: themedStyles.textColor }
                ]}
              >
                Settings
              </Text>
              <Ionicons
                name={
                  isSettingsExpanded
                    ? 'chevron-up-outline'
                    : 'chevron-down-outline'
                }
                style={[globalStyles.icon, { color: themedStyles.textColor }]}
              />
            </View>
          </TouchableOpacity>

          {isSettingsExpanded && (
            <View
              style={[
                globalStyles.sectionContent,
                { backgroundColor: themedStyles.secondaryBackgroundColor }
              ]}
            >
              <View style={styles.settingRow}>
                <Ionicons
                  name='moon-outline'
                  style={[globalStyles.icon, { color: themedStyles.textColor }]}
                />

                <Text
                  style={[
                    styles.settingLabel,
                    { color: themedStyles.textColor }
                  ]}
                >
                  Dark Mode
                </Text>
                <Switch
                  value={darkMode}
                  onValueChange={handleDarkModeToggle}
                  trackColor={{ false: colors.offWhite, true: colors.green }}
                  thumbColor={darkMode ? colors.black : '#f4f3f4'}
                />
              </View>
              <View style={styles.settingRow}>
                <Ionicons
                  name='color-wand-outline'
                  style={[globalStyles.icon, { color: themedStyles.textColor }]}
                />

                <Text
                  style={[
                    styles.settingLabel,
                    { color: themedStyles.textColor }
                  ]}
                >
                  Accent Color
                </Text>
              </View>

              <View style={styles.colorPicker}>
                {accentColors.map(color => (
                  <TouchableOpacity
                    key={color}
                    style={[styles.colorOption, { backgroundColor: color }]}
                    onPress={() => handleAccentColorChange(color)}
                  >
                    {color === state.accentColor && (
                      <View>
                        <Ionicons
                          name='checkmark-sharp'
                          size={20}
                          color={colors.black}
                        />
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </View>

        {!isEditing ? (
          <View style={globalStyles.centeredButtonContainer}>
            <TouchableOpacity
              style={[
                globalStyles.button,
                { backgroundColor: themedStyles.secondaryBackgroundColor }
              ]}
              onPress={() => setIsEditing(true)}
            >
              <Text
                style={[
                  globalStyles.buttonText,
                  { color: themedStyles.accentColor }
                ]}
              >
                EDIT
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[
                globalStyles.button,
                styles.saveButton,
                { backgroundColor: themedStyles.secondaryBackgroundColor }
              ]}
              onPress={handleSave}
            >
              <Text
                style={[
                  globalStyles.buttonText,
                  { color: themedStyles.accentColor }
                ]}
              >
                SAVE
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                globalStyles.button,
                styles.cancelButton,
                { backgroundColor: themedStyles.secondaryBackgroundColor }
              ]}
              onPress={handleCancel}
            >
              <Text
                style={[
                  globalStyles.buttonText,
                  { color: themedStyles.accentColor }
                ]}
              >
                CANCEL
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
    borderStyle: 'solid',
    borderColor: colors.red
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    borderStyle: 'solid',
    borderColor: colors.red
  },
  settingLabel: {
    fontFamily: 'Lexend',
    flex: 1,
    marginLeft: 10
  },
  colorPicker: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10
  },
  colorOption: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20
  },
  saveButton: {
    flex: 1,
    marginRight: 10
  },
  cancelButton: {
    flex: 1,
    marginLeft: 10
  }
});

export default ProfileView;
