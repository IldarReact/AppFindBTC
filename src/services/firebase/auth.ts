import { auth } from './init';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    return await signInWithPopup(auth, provider);
  } catch (error) {
    console.error('Auth error:', error);
    throw error;
  }
};

export const getCurrentUser = () => auth.currentUser;