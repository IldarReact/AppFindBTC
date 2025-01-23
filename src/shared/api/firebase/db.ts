import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from './config';
import type { User, Balance } from '../../types/tools.types';

export const createUser = async (telegramId: number, username: string, balance: Balance): Promise<void> => {
  const userRef = doc(db, 'users', telegramId.toString());

  try {
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

    console.log('Пользователь успешно создан');
  } catch (error) {
    console.error('Ошибка при создании пользователя:', error);
    throw new Error('Не удалось создать пользователя');
  }
};