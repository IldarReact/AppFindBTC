import React from 'react';
import { useBlockchainStore } from '@/store/blockchainStore';

interface HexCellProps {
    value: string | null;
    isRevealed: boolean;
    onClick: () => void;
    style: React.CSSProperties;
}

const HexCell: React.FC<HexCellProps> = ({ value, isRevealed, onClick, style }) => {
    const { sendTransaction } = useBlockchainStore();

    const handleClick = async () => {
        onClick();
        if (isRevealed && value) {
            // Пример отправки тестовой транзакции при раскрытии ячейки
            await sendTransaction('RECIPIENT_ADDRESS', parseFloat(value), 'TON');
        }
    };

    return (
        <div
            onClick={handleClick}
            className={`hex-cell ${isRevealed ? (value ? 'revealed' : 'empty') : ''}`}
            style={style}
        >
            {isRevealed && value && (
                <div className="hex-cell-content">
                    {value}
                </div>
            )}
        </div>
    );
};

export default HexCell;