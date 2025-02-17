import type React from 'react';

interface ErrorNotificationProps {
  message: string;
  onClose: () => void;
}

export const ErrorNotification: React.FC<ErrorNotificationProps> = ({
  message,
  onClose,
}) => {
  return (
    <div className="fixed bottom-4 right-4 bg-red-500 text-white p-4 rounded-md shadow-lg">
      <p>{message}</p>
      <button
        onClick={onClose}
        className="mt-2 bg-white text-red-500 px-2 py-1 rounded"
      >
        Закрыть
      </button>
    </div>
  );
};