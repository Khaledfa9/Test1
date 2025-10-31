import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Meal } from '../../types';
import Icon from '../common/Icon';

interface MealGridItemProps {
    meal: Meal;
    onTrackMeal?: (meal: Meal, weight: number) => void;
    onToggleMainMeal: (id: string) => void;
    onEditMeal: (meal: Meal) => void;
    onDeleteMeal: (id: string) => void;
}

const MealGridItem: React.FC<MealGridItemProps> = ({ meal, onTrackMeal, onToggleMainMeal, onEditMeal, onDeleteMeal }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

     useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [menuRef]);

    const menuActions = [
        { label: 'Edit', icon: 'edit' as const, action: () => onEditMeal(meal) },
        { label: 'Delete', icon: 'delete' as const, action: () => onDeleteMeal(meal.id), danger: true },
    ];


    return (
        <div className="relative group">
            <div className="aspect-square w-full bg-background rounded-2xl flex items-center justify-center border border-border overflow-hidden mb-2">
                 {meal.imageUrl ? (
                    <img src={meal.imageUrl} alt={meal.name} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                ) : (
                    <Icon name="food" className="w-10 h-10 text-text-secondary/50" />
                )}
            </div>
            <h3 className="font-bold text-text-primary truncate">{meal.name}</h3>
            <p className="text-sm text-text-secondary">{meal.caloriesPer100g} kcal / 100g</p>

            <div className="absolute top-2 right-2 flex flex-col space-y-2" ref={menuRef}>
                 <button onClick={() => onToggleMainMeal(meal.id)} className={`w-9 h-9 flex items-center justify-center rounded-full bg-card/70 backdrop-blur-sm transition-colors ${meal.isMainMeal ? 'text-yellow-400' : 'text-text-secondary hover:text-yellow-400'}`}>
                    <Icon name={meal.isMainMeal ? 'star' : 'star-outline'} className="w-5 h-5" />
                </button>
                 <div className="relative">
                    <button onClick={() => setMenuOpen(!menuOpen)} className="w-9 h-9 flex items-center justify-center rounded-full bg-card/70 backdrop-blur-sm text-text-secondary hover:text-text-primary">
                        <Icon name="more-horizontal" className="w-5 h-5" />
                    </button>
                     <AnimatePresence>
                    {menuOpen && (
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute top-full right-0 mt-2 w-40 bg-card rounded-lg shadow-xl border border-border z-10 overflow-hidden"
                        >
                            {onTrackMeal && (
                                 <button onClick={() => { onTrackMeal(meal, meal.defaultWeight); setMenuOpen(false); }} className="w-full text-left px-4 py-2 text-sm flex items-center space-x-3 text-text-primary hover:bg-background">
                                    <Icon name="add" className="w-4 h-4" />
                                    <span>Track Meal</span>
                                </button>
                            )}
                            {menuActions.map(item => (
                                 <button key={item.label} onClick={() => { item.action(); setMenuOpen(false); }} className={`w-full text-left px-4 py-2 text-sm flex items-center space-x-3 ${item.danger ? 'text-danger hover:bg-danger/10' : 'text-text-primary hover:bg-background'}`}>
                                    <Icon name={item.icon} className="w-4 h-4" />
                                    <span>{item.label}</span>
                                </button>
                            ))}
                        </motion.div>
                    )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default MealGridItem;