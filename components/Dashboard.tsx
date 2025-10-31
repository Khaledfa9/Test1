import React, { useState, useMemo } from 'react';
import { TodayLog, HistoryLog, TrackedMeal, MealCategory } from '../types';
import CircularProgress from './common/CircularProgress';
import Icon from './common/Icon';
import TrackedMealItem from './common/TrackedMealItem';
import QuickAddMeal from './QuickAddMeal';
import SaveDayModal from './SaveDayModal';
import MacroSummary from './new/MacroSummary';
import CollapsibleSection from './new/CollapsibleSection';
import FAB from './new/FAB';

interface DashboardProps {
    todaysLog: TodayLog;
    history: HistoryLog[];
    onQuickAddMeal: (meal: Omit<TrackedMeal, 'id' | 'mealId' | 'eaten' | 'category' | 'imageUrl'>) => void;
    onRemoveTrackedMeal: (id: string) => void;
    onSaveDay: (date: Date) => void;
    onToggleEaten: (id: string) => void;
    onUpdateWeight: (id: string, newWeight: number) => void;
    onTrackAllMainMeals: () => void;
    onAddMeal: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ 
    todaysLog, 
    onQuickAddMeal, 
    onRemoveTrackedMeal, 
    onSaveDay, 
    onToggleEaten, 
    onUpdateWeight, 
    onTrackAllMainMeals,
    onAddMeal
}) => {
    const [showQuickAdd, setShowQuickAdd] = useState(false);
    const [showSaveDayModal, setShowSaveDayModal] = useState(false);

    const { consumed, goals, meals: trackedMeals } = todaysLog;

    const calorieProgress = goals.calories > 0 ? (consumed.calories / goals.calories) * 100 : 0;
    
    const groupedMeals = useMemo(() => {
        return trackedMeals.reduce((acc, meal) => {
            const category = meal.category;
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(meal);
            return acc;
        }, {} as Record<MealCategory, TrackedMeal[]>);
    }, [trackedMeals]);

    const categoryOrder: MealCategory[] = [
        MealCategory.Breakfast,
        MealCategory.Lunch,
        MealCategory.Dinner,
        MealCategory.Snacks,
    ];

    const fabActions = [
        { label: 'Add from Library', icon: 'grid' as const, action: onAddMeal },
        { label: 'Quick Add', icon: 'add' as const, action: () => setShowQuickAdd(true) },
        { label: 'Add Main Meals', icon: 'star' as const, action: onTrackAllMainMeals },
    ];

    return (
        <div className="space-y-6">
            <header className="px-2">
                <p className="text-text-secondary">{new Date(todaysLog.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                <h1 className="text-4xl font-bold text-text-primary tracking-tighter">Today's Summary</h1>
            </header>

            <div className="flex justify-center pt-4">
                <CircularProgress 
                    percentage={calorieProgress} 
                    label="Calories"
                    value={consumed.calories}
                    goal={goals.calories}
                    size={200}
                    strokeWidth={16}
                    color="rgb(var(--color-primary))"
                />
            </div>
            
            <MacroSummary consumed={consumed} goals={goals} />
            
            <div className="space-y-4">
                 <h2 className="text-2xl font-bold text-text-primary tracking-tight px-2">Meals Logged</h2>
                 <div className="space-y-2">
                    {categoryOrder.map(category => {
                        const mealsInCategory = groupedMeals[category];
                        if (!mealsInCategory || mealsInCategory.length === 0) {
                            return null;
                        }
                        const totalCalories = mealsInCategory.reduce((sum, meal) => sum + meal.calories, 0);

                        return (
                            <CollapsibleSection 
                                key={category} 
                                title={category}
                                summary={`${totalCalories} kcal`}
                            >
                                <div className="space-y-1 pt-2">
                                    {mealsInCategory.map(meal => (
                                        <TrackedMealItem 
                                            key={meal.id} 
                                            meal={meal} 
                                            onToggleEaten={onToggleEaten} 
                                            onRemove={onRemoveTrackedMeal}
                                            onUpdateWeight={onUpdateWeight}
                                        />
                                    ))}
                                </div>
                            </CollapsibleSection>
                        );
                    })}
                
                    {trackedMeals.length === 0 && (
                         <div className="text-center py-12 text-text-secondary bg-background rounded-2xl">
                            <p>No meals logged yet.</p>
                            <p className="text-sm">Tap the '+' to add a meal.</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="pt-4">
                 <button onClick={() => setShowSaveDayModal(true)} className="w-full py-3.5 text-center text-white font-semibold bg-primary hover:bg-primary-accent rounded-xl transition-colors shadow-lg shadow-primary/20">
                    Finish & Save Day
                 </button>
            </div>
            {showQuickAdd && <QuickAddMeal onAdd={onQuickAddMeal} onClose={() => setShowQuickAdd(false)} />}
            <SaveDayModal 
                isOpen={showSaveDayModal}
                onClose={() => setShowSaveDayModal(false)}
                onConfirm={(date) => {
                    onSaveDay(date);
                    setShowSaveDayModal(false);
                }}
            />
            <FAB actions={fabActions} />
        </div>
    );
};

export default Dashboard;