import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator
} from 'react-native';
import { useTheme } from '../src/hooks/useTheme';
import { getThemedStyles } from '../src/utils/themeUtils';

const ForgotPasswordView = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { state: themeState } = useTheme();
  const themedStyles = getThemedStyles(
    themeState.theme,
    themeState.accentColor
  );

  const handleResetPassword = async () => {
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(
        'http://localhost:9025/api/auth/forgot-password',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to request password reset');
      }

      setSuccess(data.message);
      // In a real app, you would show a message asking the user to check their email
    } catch (err) {
      setError(err.message || 'Failed to request password reset');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: themedStyles.primaryBackgroundColor }
      ]}
    >
      <View style={styles.header}>
        <Text style={[styles.logo, { color: themedStyles.accentColor }]}>
          POW
        </Text>
        <Text style={[styles.headerText, { color: themedStyles.textColor }]}>
          RESET PASSWORD
        </Text>
      </View>

      <View style={styles.content}>
        <Text style={[styles.title, { color: themedStyles.textColor }]}>
          Reset your password
        </Text>

        <Text style={[styles.description, { color: themedStyles.textColor }]}>
          Enter your email address and we'll send you instructions to reset your
          password.
        </Text>

        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: themedStyles.secondaryBackgroundColor,
              color: themedStyles.textColor
            }
          ]}
          placeholder='Email'
          placeholderTextColor={themedStyles.textColor}
          value={email}
          onChangeText={setEmail}
          autoCapitalize='none'
          keyboardType='email-address'
        />

        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        {success ? (
          <Text
            style={[styles.successText, { color: themedStyles.accentColor }]}
          >
            {success}
          </Text>
        ) : null}

        <TouchableOpacity
          style={[
            styles.resetButton,
            { opacity: loading ? 0.7 : 1 },
            { backgroundColor: themedStyles.accentColor }
          ]}
          onPress={handleResetPassword}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color='#000' />
          ) : (
            <Text style={styles.resetButtonText}>RESET PASSWORD</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('SignIn')}
        >
          <Text
            style={[styles.backButtonText, { color: themedStyles.textColor }]}
          >
            Back to Sign In
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20
  },
  logo: {
    fontSize: 36,
    fontFamily: 'Tiny5'
  },
  headerText: {
    fontSize: 16,
    fontFamily: 'Lexend'
  },
  content: {
    flex: 1,
    padding: 20
  },
  title: {
    fontSize: 24,
    fontFamily: 'Lexend',
    marginBottom: 20
  },
  description: {
    fontSize: 16,
    fontFamily: 'Lexend',
    marginBottom: 30,
    opacity: 0.8
  },
  input: {
    height: 50,
    borderRadius: 25,
    paddingHorizontal: 20,
    marginBottom: 15,
    fontSize: 16,
    fontFamily: 'Lexend'
  },
  resetButton: {
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20
  },
  resetButtonText: {
    color: '#000',
    fontSize: 16,
    fontFamily: 'Lexend'
  },
  errorText: {
    color: '#ff4444',
    textAlign: 'center',
    marginTop: 10,
    fontFamily: 'Lexend'
  },
  successText: {
    textAlign: 'center',
    marginTop: 10,
    fontFamily: 'Lexend'
  },
  backButton: {
    marginTop: 20
  },
  backButtonText: {
    textAlign: 'center',
    fontSize: 14,
    fontFamily: 'Lexend'
  }
});

export default ForgotPasswordView;
