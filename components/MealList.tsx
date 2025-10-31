import React, { useState, useMemo } from 'react';
import { Meal } from '../types';
import Icon from './common/Icon';
import Modal from './common/Modal';
import FAB from './new/FAB';
import MealGridItem from './new/MealGridItem';

interface MealListProps {
    meals: Meal[];
    onAddMeal: () => void;
    onEditMeal: (meal: Meal) => void;
    onDeleteMeal: (id: string) => void;
    onImportMeals: () => void;
    onTrackMeal?: (meal: Meal, weight: number) => void;
    onToggleMainMeal: (id: string) => void;
}

const MealList: React.FC<MealListProps> = ({ meals, onAddMeal, onEditMeal, onDeleteMeal, onImportMeals, onTrackMeal, onToggleMainMeal }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [mealToDelete, setMealToDelete] = useState<Meal | null>(null);

    const filteredMeals = useMemo(() => {
        return meals
            .filter(meal =>
                meal.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .sort((a, b) => a.name.localeCompare(b.name));
    }, [meals, searchTerm]);

    const handleConfirmDelete = () => {
        if (mealToDelete) {
            onDeleteMeal(mealToDelete.id);
            setMealToDelete(null);
        }
    };
    
    const fabActions = [
        { label: 'Add New Meal', icon: 'add' as const, action: onAddMeal },
        { label: 'Import from File', icon: 'upload' as const, action: onImportMeals },
    ];

    return (
        <div className="space-y-6">
            <header className="px-2">
                 <p className="text-text-secondary">Your Collection</p>
                <h1 className="text-4xl font-bold text-text-primary tracking-tighter">My Meals</h1>
            </header>
            
            <div className="relative">
                <Icon name="search" className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                <input
                    type="text"
                    placeholder="Search meals..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-background border-2 border-transparent focus:border-primary focus:ring-0 rounded-full transition-colors"
                />
            </div>

            <div>
                {filteredMeals.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {filteredMeals.map(meal => (
                           <MealGridItem 
                             key={meal.id} 
                             meal={meal} 
                             onTrackMeal={onTrackMeal}
                             onToggleMainMeal={onToggleMainMeal}
                             onEditMeal={onEditMeal}
                             onDeleteMeal={() => setMealToDelete(meal)}
                           />
                        ))}
                    </div>
                ) : (
                     <div className="text-center py-20 text-text-secondary bg-background rounded-2xl">
                        <p>No meals found.</p>
                        <p className="text-sm">Tap the '+' to add your first meal.</p>
                    </div>
                )}
            </div>

            <Modal isOpen={!!mealToDelete} onClose={() => setMealToDelete(null)} title="Confirm Deletion">
                <p className="text-text-secondary mb-6">Are you sure you want to delete "{mealToDelete?.name}"? This action cannot be undone.</p>
                <div className="flex justify-end space-x-3">
                    <button onClick={() => setMealToDelete(null)} className="px-4 py-2 rounded-lg bg-border text-text-primary font-semibold">Cancel</button>
                    <button onClick={handleConfirmDelete} className="px-4 py-2 rounded-lg bg-danger text-white font-semibold">Delete</button>
                </div>
            </Modal>
            
            <FAB actions={fabActions} />
        </div>
    );
};

export default MealList;