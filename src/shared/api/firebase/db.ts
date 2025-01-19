import { doc, setDoc, updateDoc, increment, getDoc } from 'firebase/firestore';
import { db } from './config';
import type { User, Balance } from '../../types/tools.types';

export const createUser = async (telegramId: number, username: string, balance: Balance) => {
  const userRef = doc(db, 'users', telegramId.toString());
  const userDoc = await getDoc(userRef);

  if (userDoc.exists()) {
    console.log('Пользователь уже существует:', userDoc.data());
    return;
  }

  await setDoc(userRef, {
    telegramId,
    username,
    balance,
    tools: [],
    miningCount: 0,
    createdAt: new Date(),
  });
};

export const updateUserBalance = async (userId: string, currency: keyof Balance, amount: number) => {
  await updateDoc(doc(db, 'users', userId), {
    [`balance.${currency}`]: increment(amount),
  });
};

export const getUser = async (userId: string): Promise<User | null> => {
  const userDoc = await getDoc(doc(db, 'users', userId));
  return userDoc.exists() ? userDoc.data() as User : null;
};