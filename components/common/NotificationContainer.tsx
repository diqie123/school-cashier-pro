
import React, { useContext, useEffect } from 'react';
import { AppContext } from '../../contexts/AppContext';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

const Notification: React.FC<{
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
  onDismiss: (id: number) => void;
}> = ({ id, message, type, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(id);
    }, 5000);
    return () => clearTimeout(timer);
  }, [id, onDismiss]);

  const icons = {
    success: <CheckCircle className="h-5 w-5 text-green-400" />,
    error: <XCircle className="h-5 w-5 text-red-400" />,
    info: <Info className="h-5 w-5 text-blue-400" />,
  };

  const bgColors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
  }

  return (
    <div className="max-w-sm w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden">
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">{icons[type]}</div>
          <div className="ml-3 w-0 flex-1 pt-0.5">
            <p className="text-sm font-medium text-gray-900 dark:text-white">{message}</p>
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              onClick={() => onDismiss(id)}
              className="bg-white dark:bg-gray-800 rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <span className="sr-only">Close</span>
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const NotificationContainer: React.FC = () => {
  const context = useContext(AppContext);

  if (!context) return null;
  const { notifications, removeNotification } = context;

  return (
    <div className="fixed inset-0 flex items-end justify-center px-4 py-6 pointer-events-none sm:p-6 sm:items-start sm:justify-end z-50">
      <div className="max-w-sm w-full flex flex-col items-center space-y-4 sm:items-end">
        {notifications.map((n) => (
          <Notification key={n.id} {...n} onDismiss={removeNotification} />
        ))}
      </div>
    </div>
  );
};

export default NotificationContainer;
