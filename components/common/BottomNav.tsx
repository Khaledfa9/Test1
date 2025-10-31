import React from 'react';
import { motion } from 'framer-motion';
import { View } from '../../types';
import Icon from './Icon';

interface BottomNavProps {
    currentView: View;
    onChangeView: (view: View) => void;
}

const navItems: { view: View, label: string, icon: React.ComponentProps<typeof Icon>['name'] }[] = [
    { view: 'dashboard', label: 'Today', icon: 'dashboard' },
    { view: 'history', label: 'History', icon: 'log' },
    { view: 'meals', label: 'Meals', icon: 'grid' },
    { view: 'settings', label: 'Settings', icon: 'sliders' },
];

const BottomNav: React.FC<BottomNavProps> = ({ currentView, onChangeView }) => {
    return (
        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 h-20 w-full max-w-lg flex justify-center z-50">
            <div className="flex items-center justify-around w-full bg-card/80 dark:bg-card/60 backdrop-blur-xl border-t border-border">
                {navItems.map(item => (
                    <button
                        key={item.view}
                        onClick={() => onChangeView(item.view)}
                        className={`relative flex flex-col items-center justify-center w-16 h-16 rounded-full transition-colors duration-300 outline-none focus-visible:ring-2 focus-visible:ring-primary ${currentView === item.view ? 'text-primary' : 'text-text-secondary hover:text-text-primary'}`}
                        aria-label={item.label}
                    >
                        {currentView === item.view && (
                            <motion.div
                                layoutId="active-nav-indicator"
                                className="absolute h-10 w-16 bg-primary/10 rounded-full z-0"
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                            />
                        )}
                        <Icon name={item.icon} className="w-7 h-7 z-10" />
                    </button>
                ))}
            </div>
        </nav>
    );
};

export default BottomNav;
