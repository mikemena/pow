import exp from 'constants';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification
} from 'firebase/auth';

// Initialize Firebase Authentication
const auth = getAuth();

// Register a new user
export const registerUser = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    await sendEmailVerification(userCredential.user);
    return userCredential.user;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error; // Let the calling component handle the error
  }
};

// Log in a user
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error; // Let the calling component handle the error
  }
};

// Log out a user
export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error logging out:', error);
    throw error; // Let the calling component handle the error
  }
};
