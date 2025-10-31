import React from 'react';
import { motion } from 'framer-motion';
import { HistoryLog } from '../../types';
import Icon from '../common/Icon';
import MacroSummary from './MacroSummary';

interface HistoryDetailProps {
    log: HistoryLog;
    onClose: () => void;
    onDelete: (id: string) => void;
}

const HistoryDetail: React.FC<HistoryDetailProps> = ({ log, onClose, onDelete }) => {
    return (
        <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-0 bg-card z-50 p-4 pt-8 overflow-y-auto"
        >
             <header className="flex justify-between items-center mb-6">
                <button type="button" onClick={onClose} className="p-2 rounded-full hover:bg-background">
                    <Icon name="back" className="h-6 w-6 text-text-secondary" />
                </button>
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-text-primary tracking-tight">{log.date}</h1>
                    <p className="text-text-secondary">{new Date(log.isoDate).toLocaleDateString('en-US', { weekday: 'long' })}</p>
                </div>
                 <button type="button" onClick={() => onDelete(log.id)} className="p-2 rounded-full hover:bg-background text-danger">
                    <Icon name="delete" className="h-6 w-6" />
                </button>
            </header>
            
            <div className="space-y-6">
                <MacroSummary consumed={log.consumed} goals={log.goals} />

                <div>
                    <h2 className="text-xl font-bold text-text-primary mb-2">Logged Meals</h2>
                    <div className="space-y-2">
                        {log.meals.map(meal => (
                             <div key={meal.id} className="flex items-center bg-background p-3 rounded-xl space-x-4">
                                <div className="w-12 h-12 bg-border rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden">
                                    {meal.imageUrl ? (
                                        <img src={meal.imageUrl} alt={meal.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <Icon name="food" className="w-6 h-6 text-text-secondary" />
                                    )}
                                </div>
                                <div className="flex-grow">
                                    <p className="font-semibold text-text-primary">{meal.name}</p>
                                    <p className="text-sm text-text-secondary">{meal.weight}g</p>
                                </div>
                                <p className="text-sm font-medium text-text-primary flex-shrink-0">{meal.calories} kcal</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default HistoryDetail;