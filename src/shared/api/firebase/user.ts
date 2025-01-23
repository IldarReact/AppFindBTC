import { doc, updateDoc, increment, getDoc } from 'firebase/firestore';
import { db } from './config';
import type { Balance } from '../../types/tools.types';

export const updateUserBalance = async (userId: string, currency: keyof Balance, amount: number): Promise<void> => {
    const userRef = doc(db, 'users', userId);

    try {
        // Получаем текущий баланс пользователя
        const userDoc = await getDoc(userRef);
        if (!userDoc.exists()) {
            throw new Error('Пользователь не найден');
        }

        const currentBalance = userDoc.data().balance[currency] || 0;

        // Проверяем, что баланс не станет отрицательным
        if (currentBalance + amount < 0) {
            throw new Error('Недостаточно средств');
        }

        // Обновляем баланс
        await updateDoc(userRef, {
            [`balance.${currency}`]: increment(amount),
        });

        console.log(`Баланс пользователя ${userId} успешно обновлён`);
    } catch (error) {
        console.error('Ошибка при обновлении баланса:', error);
        throw new Error('Не удалось обновить баланс');
    }
};