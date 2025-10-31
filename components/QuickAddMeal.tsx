import React, { useState } from 'react';
import { TrackedMeal } from '../types';
import Icon from './common/Icon';

interface QuickAddMealProps {
    onAdd: (meal: Omit<TrackedMeal, 'id' | 'mealId' | 'eaten' | 'category' | 'imageUrl'>) => void;
    onClose: () => void;
}

const QuickAddMeal: React.FC<QuickAddMealProps> = ({ onAdd, onClose }) => {
    const [name, setName] = useState('');
    const [calories, setCalories] = useState('');
    const [protein, setProtein] = useState('');
    const [carbs, setCarbs] = useState('');
    const [fat, setFat] = useState('');
    const [weight, setWeight] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAdd({
            name: name || 'Quick Add',
            calories: parseInt(calories) || 0,
            protein: parseInt(protein) || 0,
            carbs: parseInt(carbs) || 0,
            fat: parseInt(fat) || 0,
            weight: parseInt(weight) || 0,
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-end p-4" onClick={onClose}>
            <div className="bg-card rounded-2xl shadow-xl w-full max-w-md p-6 space-y-6 animate-slide-in-up" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-text-primary">Quick Add</h2>
                    <button onClick={onClose} className="text-text-secondary p-1 rounded-full hover:bg-border">
                        <Icon name="close" className="w-5 h-5"/>
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" placeholder="Meal Name (optional)" value={name} onChange={e => setName(e.target.value)} className="w-full p-3 bg-background border border-border rounded-lg" />
                    <div className="grid grid-cols-2 gap-4">
                        <input type="number" placeholder="Calories *" value={calories} onChange={e => setCalories(e.target.value)} className="w-full p-3 bg-background border border-border rounded-lg" required />
                        <input type="number" placeholder="Weight (g)" value={weight} onChange={e => setWeight(e.target.value)} className="w-full p-3 bg-background border border-border rounded-lg" />
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        <input type="number" placeholder="Protein" value={protein} onChange={e => setProtein(e.target.value)} className="w-full p-3 bg-background border border-border rounded-lg" />
                        <input type="number" placeholder="Carbs" value={carbs} onChange={e => setCarbs(e.target.value)} className="w-full p-3 bg-background border border-border rounded-lg" />
                        <input type="number" placeholder="Fat" value={fat} onChange={e => setFat(e.target.value)} className="w-full p-3 bg-background border border-border rounded-lg" />
                    </div>
                    <div className="flex justify-end space-x-3 pt-2">
                        <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-lg bg-border text-text-primary font-semibold">Cancel</button>
                        <button type="submit" className="px-5 py-2.5 rounded-lg bg-primary text-white font-semibold">Add Meal</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default QuickAddMeal;