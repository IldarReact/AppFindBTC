import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const config = import.meta.env.VITE_FIREBASE_CONFIG;

if (!config) {
    throw new Error('Missing Firebase configuration');
}

const firebaseConfig = JSON.parse(config);

export default firebaseConfig;

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
