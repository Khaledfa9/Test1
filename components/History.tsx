import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { HistoryLog } from '../types';
import Icon from './common/Icon';
import Modal from './common/Modal';
import WeeklyBalanceChart from './common/WeeklyBalanceChart';
import HistoryDetail from './new/HistoryDetail';

interface HistoryProps {
    history: HistoryLog[];
    onDeleteLog: (id: string) => void;
}

const History: React.FC<HistoryProps> = ({ history, onDeleteLog }) => {
    const [selectedLog, setSelectedLog] = useState<HistoryLog | null>(null);
    const [logToDelete, setLogToDelete] = useState<HistoryLog | null>(null);

    const handleConfirmDelete = () => {
        if (logToDelete) {
            onDeleteLog(logToDelete.id);
            setLogToDelete(null);
        }
    };

    return (
        <div className="space-y-6">
            <header className="px-2">
                <p className="text-text-secondary">Your Progress</p>
                <h1 className="text-4xl font-bold text-text-primary tracking-tighter">History</h1>
            </header>
            
            <WeeklyBalanceChart history={history} />

            {history.length > 0 ? (
                <div className="space-y-3">
                    {history.map(log => (
                        <div key={log.id} className="bg-background p-4 rounded-2xl transition-all cursor-pointer hover:ring-2 hover:ring-primary" onClick={() => setSelectedLog(log)}>
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="font-bold text-lg text-text-primary">{log.date}</h3>
                                    <p className="text-sm text-text-secondary">{new Date(log.isoDate).toLocaleDateString('en-US', { weekday: 'long' })}</p>
                                </div>
                                <div className="text-right">
                                     <p className="font-bold text-lg text-text-primary">{log.consumed.calories} <span className="text-sm font-normal text-text-secondary">kcal</span></p>
                                     <p className="text-sm text-text-secondary">{log.meals.length} items</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 text-text-secondary bg-background rounded-2xl">
                    <p>No saved logs yet.</p>
                    <p className="text-sm">Your history will appear here after you save a day's log.</p>
                </div>
            )}
            
            <AnimatePresence>
                {selectedLog && (
                    <HistoryDetail 
                        log={selectedLog} 
                        onClose={() => setSelectedLog(null)}
                        onDelete={(id) => {
                            setSelectedLog(null);
                            // a small delay to allow the panel to close before showing the modal
                            setTimeout(() => setLogToDelete(history.find(h => h.id === id) || null), 300);
                        }}
                    />
                )}
            </AnimatePresence>


            <Modal isOpen={!!logToDelete} onClose={() => setLogToDelete(null)} title="Confirm Deletion">
                <p className="text-text-secondary mb-6">Are you sure you want to delete the log for {logToDelete?.date}? This action cannot be undone.</p>
                <div className="flex justify-end space-x-3">
                    <button onClick={() => setLogToDelete(null)} className="px-4 py-2 rounded-lg bg-border text-text-primary font-semibold">Cancel</button>
                    <button onClick={handleConfirmDelete} className="px-4 py-2 rounded-lg bg-danger text-white font-semibold">Delete</button>
                </div>
            </Modal>
        </div>
    );
};

export default History;