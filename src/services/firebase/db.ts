import { db } from './init';
import { 
  collection,
  doc,
  setDoc,
  updateDoc,
  onSnapshot
} from 'firebase/firestore';
import type { UserProfile } from './types';

export const userCollection = collection(db, 'users');
export const toolsCollection = collection(db, 'tools');
export const fieldsCollection = collection(db, 'fields');

export const createUserProfile = async (userId: string, data: Partial<UserProfile>) => {
  await setDoc(doc(userCollection, userId), data);
};

export const updateUserBalance = async (userId: string, balance: number) => {
  await updateDoc(doc(userCollection, userId), { balance });
};

export const subscribeToUserData = (
  userId: string, 
  callback: (data: UserProfile | null) => void
) => {
  return onSnapshot(doc(userCollection, userId), 
    (doc) => callback(doc.data() as UserProfile | null)
  );
};