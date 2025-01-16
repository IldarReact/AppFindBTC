import { doc, setDoc, updateDoc, increment, getDoc } from 'firebase/firestore';
import { db } from './config';
import type { User } from '../../types/tools.types';

export const createUser = async (telegramId: number, username: string) => {
  await setDoc(doc(db, 'users', telegramId.toString()), {
    telegramId,
    username,
    balance: 0,
    tools: [],
    miningCount: 0,
    createdAt: new Date()
  });
};

export const updateUserBalance = async (userId: string, amount: number) => {
  await updateDoc(doc(db, 'users', userId), {
    balance: increment(amount)
  });
};

export const getUser = async (userId: string): Promise<User | null> => {
  const userDoc = await getDoc(doc(db, 'users', userId));
  return userDoc.exists() ? userDoc.data() as User : null;
};