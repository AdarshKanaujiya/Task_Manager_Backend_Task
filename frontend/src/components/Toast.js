import React, { useEffect } from 'react';
import '../styles/toast.css';

const Toast = ({ message, type = 'success', onClose, duration }) => {
  // Default duration: 5 seconds for errors, 6 seconds for success (visible during redirect)
  const finalDuration = duration !== undefined ? duration : (type === 'error' ? 5000 : 6000);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose();
      }, finalDuration);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [message, onClose, finalDuration, type]);

  if (!message) return null;

  return (
    <div className={`toast toast-${type}`}>
      <span className="toast-icon">
        {type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}
      </span>
      <span className="toast-message">{message}</span>
      <button className="toast-close" onClick={onClose}>×</button>
    </div>
  );
};

export default Toast;
