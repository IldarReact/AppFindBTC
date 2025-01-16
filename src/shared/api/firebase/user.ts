import { doc, updateDoc, increment } from 'firebase/firestore';
import { db } from './config';

export const updateUserBalance = async (userId: string, amount: number) => {
    console.log(`Обновляем баланс пользователя ${userId} на ${amount}...`);
    await updateDoc(doc(db, 'users', userId), {
        balance: increment(amount)
    });
    console.log(`Баланс пользователя ${userId} успешно обновлен.`);
};