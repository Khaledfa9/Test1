import React, { useState, useEffect } from 'react';
import Modal from './common/Modal';

interface SaveDayModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (date: Date) => void;
}

const months = [
    { value: 0, name: 'January' }, { value: 1, name: 'February' },
    { value: 2, name: 'March' }, { value: 3, name: 'April' },
    { value: 4, name: 'May' }, { value: 5, name: 'June' },
    { value: 6, name: 'July' }, { value: 7, name: 'August' },
    { value: 8, name: 'September' }, { value: 9, name: 'October' },
    { value: 10, name: 'November' }, { value: 11, name: 'December' }
];

const SaveDayModal: React.FC<SaveDayModalProps> = ({ isOpen, onClose, onConfirm }) => {
    const today = new Date();
    const [month, setMonth] = useState(today.getMonth());
    const [day, setDay] = useState(today.getDate());

    // Reset state to today's date whenever the modal is opened
    useEffect(() => {
        if (isOpen) {
            const now = new Date();
            setMonth(now.getMonth());
            setDay(now.getDate());
        }
    }, [isOpen]);

    const year = today.getFullYear();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Adjust day if it becomes invalid for the newly selected month
    useEffect(() => {
        if (day > daysInMonth) {
            setDay(daysInMonth);
        }
    }, [month, day, daysInMonth]);

    const handleConfirm = () => {
        const selectedDate = new Date(year, month, day);
        onConfirm(selectedDate);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Save and Reset Day">
            <div className="space-y-4">
                <p className="text-text-secondary">Select the date for the log you are saving. This will archive your current progress and start a fresh day on the dashboard.</p>
                <div className="flex gap-4">
                    <div className="flex-1">
                        <label htmlFor="month-select" className="block text-sm font-medium text-text-secondary">Month</label>
                        <select
                            id="month-select"
                            value={month}
                            onChange={(e) => setMonth(Number(e.target.value))}
                            className="mt-1 block w-full px-4 py-3 bg-background border border-border rounded-lg"
                        >
                            {months.map(m => <option key={m.value} value={m.value}>{m.name}</option>)}
                        </select>
                    </div>
                    <div className="flex-1">
                        <label htmlFor="day-select" className="block text-sm font-medium text-text-secondary">Day</label>
                        <select
                            id="day-select"
                            value={day}
                            onChange={(e) => setDay(Number(e.target.value))}
                            className="mt-1 block w-full px-4 py-3 bg-background border border-border rounded-lg"
                        >
                            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(d => (
                                <option key={d} value={d}>{d}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                    <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-border text-text-primary font-semibold">Cancel</button>
                    <button type="button" onClick={handleConfirm} className="px-4 py-2 rounded-lg bg-primary text-white font-semibold">Save & Reset</button>
                </div>
            </div>
        </Modal>
    );
};

export default SaveDayModal;