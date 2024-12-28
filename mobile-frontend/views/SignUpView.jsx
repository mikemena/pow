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
import { useAuth } from '../src/context/authContext';
import { useTheme } from '../src/hooks/useTheme';
import { getThemedStyles } from '../src/utils/themeUtils';
import { Ionicons } from '@expo/vector-icons';

const SignUpView = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { signIn } = useAuth();
  const { state: themeState } = useTheme();
  const themedStyles = getThemedStyles(
    themeState.theme,
    themeState.accentColor
  );

  const handleSignUp = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:9025/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Sign up failed');
      }

      // Auto sign-in after successful registration
      await signIn(data.token, data.user);
    } catch (err) {
      setError(err.message || 'Failed to sign up');
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
          SIGN UP
        </Text>
      </View>

      <View style={styles.content}>
        <Text style={[styles.title, { color: themedStyles.textColor }]}>
          Sign up
        </Text>

        <TouchableOpacity
          style={[
            styles.socialButton,
            { backgroundColor: themedStyles.secondaryBackgroundColor }
          ]}
          onPress={() => {}}
        >
          <Ionicons
            name='logo-google'
            size={20}
            color={themedStyles.accentColor}
          />
          <Text
            style={[
              styles.socialButtonText,
              { color: themedStyles.accentColor }
            ]}
          >
            Sign up with Google
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.socialButton,
            { backgroundColor: themedStyles.secondaryBackgroundColor }
          ]}
          onPress={() => {}}
        >
          <Ionicons
            name='logo-apple'
            size={20}
            color={themedStyles.accentColor}
          />
          <Text
            style={[
              styles.socialButtonText,
              { color: themedStyles.accentColor }
            ]}
          >
            Sign up with Apple
          </Text>
        </TouchableOpacity>

        <View style={styles.dividerContainer}>
          <View
            style={[
              styles.divider,
              { backgroundColor: themedStyles.textColor }
            ]}
          />
          <Text style={[styles.dividerText, { color: themedStyles.textColor }]}>
            Or continue with
          </Text>
          <View
            style={[
              styles.divider,
              { backgroundColor: themedStyles.textColor }
            ]}
          />
        </View>

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

        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: themedStyles.secondaryBackgroundColor,
              color: themedStyles.textColor
            }
          ]}
          placeholder='Password'
          placeholderTextColor={themedStyles.textColor}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TouchableOpacity
          style={[
            styles.signInButton,
            { opacity: loading ? 0.7 : 1 },
            { backgroundColor: themedStyles.accentColor }
          ]}
          onPress={handleSignUp}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color='#000' />
          ) : (
            <Text style={styles.signInButtonText}>CONTINUE</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.switchAuthButton}
          onPress={() => navigation.navigate('SignIn')}
        >
          <Text
            style={[styles.switchAuthText, { color: themedStyles.textColor }]}
          >
            Already have an account?{' '}
            <Text style={{ color: themedStyles.accentColor }}>Log In</Text>
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
    marginBottom: 30
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 25,
    marginBottom: 15
  },
  socialButtonText: {
    marginLeft: 10,
    fontSize: 16,
    fontFamily: 'Lexend'
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20
  },
  divider: {
    flex: 1,
    height: 1,
    opacity: 0.2
  },
  dividerText: {
    marginHorizontal: 10,
    fontSize: 14,
    fontFamily: 'Lexend',
    opacity: 0.6
  },
  input: {
    height: 50,
    borderRadius: 25,
    paddingHorizontal: 20,
    marginBottom: 15,
    fontSize: 16,
    fontFamily: 'Lexend'
  },
  forgotPassword: {
    textAlign: 'center',
    marginVertical: 15,
    fontSize: 14,
    fontFamily: 'Lexend'
  },
  signInButton: {
    backgroundColor: '#A5FF32',
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20
  },
  signInButtonText: {
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
  switchAuthButton: {
    marginTop: 20
  },
  switchAuthText: {
    textAlign: 'center',
    fontSize: 14,
    fontFamily: 'Lexend'
  }
});

export default SignUpView;
