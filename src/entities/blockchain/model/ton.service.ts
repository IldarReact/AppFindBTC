import { Balance } from '@/shared/types/blockchain.types';
import { Address, TonClient, WalletContractV4, internal, fromNano, toNano } from '@ton/ton';
import { mnemonicToPrivateKey } from '@ton/crypto';

export const TonService = () => {
    const client = new TonClient({
        endpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC',
        apiKey: import.meta.env.VITE_TONCENTER_API_KEY,
    });

    // Получаем приватный ключ из мнемонической фразы (или из переменных окружения)
    const getPrivateKey = async (): Promise<{ publicKey: Buffer; secretKey: Buffer }> => {
        const mnemonic = import.meta.env.VITE_TON_MNEMONIC; // Мнемоническая фраза из .env
        if (!mnemonic) {
            throw new Error('Mnemonic phrase is not defined in environment variables');
        }
        return mnemonicToPrivateKey(mnemonic.split(' '));
    };

    const getBalance = async (address: string): Promise<Balance> => {
        try {
            const balance = await client.getBalance(Address.parse(address));
            return {
                amount: balance.toString(),
                formatted: fromNano(balance), // Конвертируем наноTON в TON
            };
        } catch (error) {
            console.error('Ошибка при получении баланса TON:', error);
            throw new Error('Не удалось получить баланс TON');
        }
    };

    const sendTransaction = async (to: string, amount: string): Promise<string> => {
        try {
            // Получаем приватный ключ
            const { publicKey, secretKey } = await getPrivateKey();

            // Создаём кошелёк
            const wallet = WalletContractV4.create({ publicKey, workchain: 0 });
            const walletContract = client.open(wallet);

            // Получаем текущий баланс кошелька
            const senderBalance = await walletContract.getBalance();
            const amountNano = toNano(amount); // Конвертируем TON в наноTON

            // Проверяем, что баланс достаточен для отправки
            if (senderBalance < amountNano) {
                throw new Error('Недостаточно средств для отправки транзакции');
            }

            // Создаём транзакцию
            const seqno = await walletContract.getSeqno();
            const transfer = walletContract.createTransfer({
                seqno,
                secretKey,
                messages: [
                    internal({
                        to: Address.parse(to),
                        value: amountNano,
                        body: 'Hello, TON!', // Опциональное сообщение
                    }),
                ],
            });

            // Отправляем транзакцию
            await walletContract.send(transfer);

            // Возвращаем хэш транзакции (в реальности TON не возвращает хэш сразу, нужно отслеживать статус)
            return `ton_transaction_${seqno}`; // Временная заглушка
        } catch (error) {
            console.error('Ошибка при отправке транзакции TON:', error);
            throw new Error('Не удалось отправить транзакцию TON');
        }
    };

    const validateAddress = (address: string): boolean => {
        try {
            Address.parse(address);
            return true;
        } catch {
            return false;
        }
    };

    return {
        getBalance,
        sendTransaction,
        validateAddress,
    };
};