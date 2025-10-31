import React, { useState, useRef, useEffect } from 'react';
import { TrackedMeal } from '../../types';
import Icon from './Icon';

interface TrackedMealItemProps {
    meal: TrackedMeal;
    onToggleEaten: (id: string) => void;
    onRemove: (id: string) => void;
    onUpdateWeight: (id: string, newWeight: number) => void;
}

const TrackedMealItem: React.FC<TrackedMealItemProps> = ({ meal, onToggleEaten, onRemove, onUpdateWeight }) => {
    const [isEditingWeight, setIsEditingWeight] = useState(false);
    const [weight, setWeight] = useState(meal.weight.toString());
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isEditingWeight) {
            inputRef.current?.select();
        }
    }, [isEditingWeight]);

    const handleWeightBlur = () => {
        const newWeight = parseInt(weight, 10);
        if (!isNaN(newWeight) && newWeight >= 0 && newWeight !== meal.weight) {
            onUpdateWeight(meal.id, newWeight);
        } else {
            setWeight(meal.weight.toString()); // Revert if invalid
        }
        setIsEditingWeight(false);
    };
    
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleWeightBlur();
        } else if (e.key === 'Escape') {
            setWeight(meal.weight.toString());
            setIsEditingWeight(false);
        }
    };

    return (
        <div className={`flex items-center p-2 rounded-lg transition-colors group ${meal.eaten ? '' : 'opacity-50'}`}>
            <button onClick={() => onToggleEaten(meal.id)} className="mr-3 flex-shrink-0 p-1">
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center border-2 transition-all duration-200 ${meal.eaten ? 'bg-primary border-primary scale-100' : 'border-border group-hover:border-primary scale-90 group-hover:scale-100'}`}>
                    {meal.eaten && <Icon name="check" className="w-4 h-4 text-white" />}
                </div>
            </button>
            <div className="w-12 h-12 bg-background rounded-lg flex-shrink-0 mr-4 flex items-center justify-center border border-border overflow-hidden">
                {meal.imageUrl ? (
                    <img src={meal.imageUrl} alt={meal.name} className="w-full h-full object-cover" />
                ) : (
                    <Icon name="food" className="w-6 h-6 text-text-secondary" />
                )}
            </div>
            <div className="flex-grow">
                <p className={`font-semibold`}>{meal.name}</p>
                <div className="text-sm text-text-secondary flex space-x-2 items-center">
                    <span>{meal.calories} kcal</span>
                    <span className="text-border">&bull;</span>
                    {isEditingWeight ? (
                        <input
                            ref={inputRef}
                            type="number"
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                            onBlur={handleWeightBlur}
                            onKeyDown={handleKeyDown}
                            className="w-16 bg-transparent border-b border-primary text-text-primary text-sm outline-none p-0"
                        />
                    ) : (
                         <span onClick={() => setIsEditingWeight(true)} className="cursor-pointer hover:underline">{meal.weight}g</span>
                    )}
                </div>
            </div>
            <button onClick={() => onRemove(meal.id)} className="text-text-secondary hover:text-danger p-2 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Icon name="close" className="w-4 h-4" />
            </button>
        </div>
    );
};

export default TrackedMealItem;