import React, { useEffect, useState } from 'react';
import Icon from './Icon';
import { ToastState } from '../../types';

interface ToastProps extends ToastState {
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ show, message, type, onClose }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (show) {
            setIsVisible(true);
        } else {
            const timer = setTimeout(() => setIsVisible(false), 300); // Wait for fade out
            return () => clearTimeout(timer);
        }
    }, [show]);

    if (!isVisible) return null;
    
    const baseClasses = 'fixed top-5 right-5 flex items-center p-4 rounded-lg shadow-lg text-white z-50 transition-all duration-300';
    const typeClasses = {
        success: 'bg-success',
        error: 'bg-danger',
        info: 'bg-primary',
    };
    const iconName = {
        success: 'check' as const,
        error: 'close' as const,
        info: 'info' as const,
    };

    return (
        <div className={`${baseClasses} ${typeClasses[type]} ${show ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
            <Icon name={iconName[type]} className="w-5 h-5 mr-3" />
            <span>{message}</span>
            <button onClick={onClose} className="ml-4 -mr-2 p-1 rounded-full hover:bg-white/20">
                <Icon name="close" className="w-4 h-4" />
            </button>
        </div>
    );
};

export default Toast;