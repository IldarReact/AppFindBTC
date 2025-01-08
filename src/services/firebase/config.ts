const config = import.meta.env.VITE_FIREBASE_CONFIG;
if (!config) throw new Error('Missing Firebase configuration');

const firebaseConfig = JSON.parse(config);
export default firebaseConfig;