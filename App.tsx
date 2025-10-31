import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TodayLog, HistoryLog, Meal, View, TrackedMeal, MealCategory, ToastState, DailyGoals } from './types';
import useLocalStorage from './hooks/useLocalStorage';
import { useTheme } from './hooks/useTheme';
import Dashboard from './components/Dashboard';
import BottomNav from './components/common/BottomNav';
import History from './components/History';
import MealList from './components/MealList';
import Settings from './components/Settings';
import AddMealForm from './components/AddMealForm';
import MealExtractor from './components/MealExtractor';
import Toast from './components/common/Toast';
import { seedMeals } from './data/seedMeals';
import Icon from './components/common/Icon';

const API_KEY = (typeof process !== 'undefined' && process.env) ? process.env.API_KEY : undefined;
const DEFAULT_GOALS: DailyGoals = { calories: 2000, protein: 150, carbs: 200, fat: 60 };

const App: React.FC = () => {
    const [theme, setTheme] = useTheme();
    const [accent, setAccent] = useLocalStorage<string>('accentColor', 'green');
    const [view, setView] = useState<View>('dashboard');
    const [meals, setMeals] = useLocalStorage<Meal[]>('meals', seedMeals);
    const [history, setHistory] = useLocalStorage<HistoryLog[]>('history', []);
    const [goals, setGoals] = useLocalStorage<DailyGoals>('dailyGoals', DEFAULT_GOALS);
    const [todaysLog, setTodaysLog] = useLocalStorage<TodayLog>('todaysLog', {
        date: new Date().toDateString(),
        consumed: { calories: 0, protein: 0, carbs: 0, fat: 0 },
        goals: goals,
        meals: [],
    });

    const [mealToEdit, setMealToEdit] = useState<Meal | undefined>(undefined);
    const [toast, setToast] = useState<ToastState>({ show: false, message: '', type: 'info' });

    // CRITICAL FIX: This refactored effect handles new day logic and goal synchronization
    // without causing an infinite loop. It uses a functional update for `setTodaysLog`
    // to avoid a dependency on `todaysLog` itself, which was the root cause of the crash.
    useEffect(() => {
        const todayString = new Date().toDateString();
        
        setTodaysLog(currentLog => {
            const isNewDay = currentLog.date !== todayString;
            const areGoalsOutOfSync = JSON.stringify(currentLog.goals) !== JSON.stringify(goals);

            // If the log is already up-to-date, return it as-is to prevent a re-render.
            if (!isNewDay && !areGoalsOutOfSync) {
                return currentLog;
            }
            
            // If it's a new day, create a fresh log for today.
            if (isNewDay) {
                return {
                    date: todayString,
                    consumed: { calories: 0, protein: 0, carbs: 0, fat: 0 },
                    goals: goals, // Use the latest goals
                    meals: [],
                };
            }
            
            // Otherwise, it's the same day, just sync the goals from settings.
            return {
                ...currentLog,
                goals: goals,
            };
        });
    }, [goals, setTodaysLog]); // This effect now only runs when goals change.


    // Effect to apply the accent color theme class to the root element
    useEffect(() => {
        const root = document.documentElement;
        // Remove any existing theme- class
        root.className.split(' ').forEach(className => {
            if (className.startsWith('theme-')) {
                root.classList.remove(className);
            }
        });
        // Add the new theme class
        root.classList.add(`theme-${accent}`);
    }, [accent]);

    const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
    };
    
    const updateTodaysMealsAndConsumed = (mealUpdater: (meals: TrackedMeal[]) => TrackedMeal[]) => {
        setTodaysLog(prevLog => {
            const newMeals = mealUpdater(prevLog.meals);
            const newConsumed = newMeals.reduce(
                (acc, meal) => {
                    if (meal.eaten) {
                        acc.calories += meal.calories;
                        acc.protein += meal.protein;
                        acc.carbs += meal.carbs;
                        acc.fat += meal.fat;
                    }
                    return acc;
                },
                { calories: 0, protein: 0, carbs: 0, fat: 0 }
            );
            return {
                ...prevLog,
                meals: newMeals,
                consumed: newConsumed,
            };
        });
    };

    const handleSaveMeal = (meal: Meal) => {
        const isEditing = meals.some(m => m.id === meal.id);
        setMeals(prev => isEditing ? prev.map(m => m.id === meal.id ? meal : m) : [...prev, meal]);
        setView('meals');
        setMealToEdit(undefined);
        showToast(isEditing ? 'Meal updated!' : 'Meal saved!', 'success');
    };

    const handleDeleteMeal = (id: string) => {
        setMeals(prev => prev.filter(m => m.id !== id));
        showToast('Meal deleted!', 'success');
    };

    const handleEditMeal = (meal: Meal) => {
        setMealToEdit(meal);
        setView('editMeal');
    };

    const handleTrackMeal = (meal: Meal, weight: number) => {
        const scale = weight / 100;
        const trackedMeal: TrackedMeal = {
            id: crypto.randomUUID(),
            mealId: meal.id,
            name: meal.name,
            weight: weight,
            calories: Math.round(meal.caloriesPer100g * scale),
            protein: Math.round(meal.proteinPer100g * scale),
            carbs: Math.round(meal.carbsPer100g * scale),
            fat: Math.round(meal.fatPer100g * scale),
            eaten: true,
            category: meal.category,
            imageUrl: meal.imageUrl,
        };
        updateTodaysMealsAndConsumed(prevMeals => [...prevMeals, trackedMeal]);
        showToast(`${meal.name} added to today's log!`, 'success');
        setView('dashboard');
    };
    
    const handleQuickAddMeal = (meal: Omit<TrackedMeal, 'id' | 'mealId' | 'eaten' | 'category' | 'imageUrl'>) => {
        const quickAddedMeal: TrackedMeal = {
            ...meal,
            id: crypto.randomUUID(),
            mealId: null,
            eaten: true,
            category: MealCategory.Snacks,
            imageUrl: '',
        };
        updateTodaysMealsAndConsumed(prevMeals => [...prevMeals, quickAddedMeal]);
        showToast(`${meal.name} quick-added!`, 'success');
    };

    const handleRemoveTrackedMeal = (id: string) => {
        updateTodaysMealsAndConsumed(prevMeals => prevMeals.filter(m => m.id !== id));
    };
    
    const handleToggleEaten = (id: string) => {
        updateTodaysMealsAndConsumed(prevMeals => 
            prevMeals.map(m => m.id === id ? { ...m, eaten: !m.eaten } : m)
        );
    };

     const handleUpdateWeight = (id: string, newWeight: number) => {
        updateTodaysMealsAndConsumed(prevMeals => prevMeals.map(m => {
            if (m.id !== id) return m;

            const originalMeal = meals.find(sm => sm.id === m.mealId);
            if (!originalMeal) {
                 const oldWeight = m.weight || 1;
                 if (oldWeight === 0) return m;
                 const scale = newWeight / oldWeight;
                 return { 
                    ...m, 
                    weight: newWeight,
                    calories: Math.round(m.calories * scale),
                    protein: Math.round(m.protein * scale),
                    carbs: Math.round(m.carbs * scale),
                    fat: Math.round(m.fat * scale),
                 };
            }
            const scale = newWeight / 100;
            return {
                ...m,
                weight: newWeight,
                calories: Math.round(originalMeal.caloriesPer100g * scale),
                protein: Math.round(originalMeal.proteinPer100g * scale),
                carbs: Math.round(originalMeal.carbsPer100g * scale),
                fat: Math.round(originalMeal.fatPer100g * scale),
            };
        }));
    };

    const handleSaveDay = (selectedDate: Date) => {
        if (todaysLog.meals.length === 0) {
            showToast("Log is empty, nothing to save.", 'info');
            return;
        }
    
        const logDateString = selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
        
        setHistory(prevHistory => {
            const newHistory = [...prevHistory];
            const existingLogIndex = newHistory.findIndex(log => log.isoDate.startsWith(selectedDate.toISOString().split('T')[0]));

            if (existingLogIndex !== -1) {
                // Update existing log
                newHistory[existingLogIndex] = {
                    ...newHistory[existingLogIndex],
                    date: logDateString,
                    consumed: todaysLog.consumed,
                    goals: todaysLog.goals,
                    meals: todaysLog.meals,
                    isoDate: selectedDate.toISOString(),
                };
                showToast(`Log for ${logDateString} updated!`, 'success');
            } else {
                // Add new log
                const newHistoryLog: HistoryLog = {
                    id: crypto.randomUUID(),
                    date: logDateString,
                    isoDate: selectedDate.toISOString(),
                    consumed: todaysLog.consumed,
                    goals: todaysLog.goals,
                    meals: todaysLog.meals,
                };
                newHistory.push(newHistoryLog);
                showToast(`Log for ${logDateString} saved!`, 'success');
            }
             return newHistory.sort((a, b) => new Date(b.isoDate).getTime() - new Date(a.isoDate).getTime());
        });
    
        // Reset today's log
        setTodaysLog({
            date: new Date().toDateString(),
            consumed: { calories: 0, protein: 0, carbs: 0, fat: 0 },
            goals: goals,
            meals: [],
        });
    
        setView('history');
    };
    
    const sortedHistory = useMemo(() => {
        return [...history].sort((a, b) => new Date(b.isoDate).getTime() - new Date(a.isoDate).getTime());
    }, [history]);
    
    const handleDeleteHistoryLog = (id: string) => {
        setHistory(prev => prev.filter(log => log.id !== id));
        showToast('Log deleted!', 'success');
    };

    const handleSaveExtractedMeals = (newMeals: Meal[]) => {
        setMeals(prev => [...prev, ...newMeals]);
        setView('meals');
        showToast(`${newMeals.length} meals imported successfully!`, 'success');
    };

    const handleToggleMainMeal = (id: string) => {
        setMeals(prevMeals => 
            prevMeals.map(m => m.id === id ? { ...m, isMainMeal: !m.isMainMeal } : m)
        );
    };

    const handleTrackAllMainMeals = () => {
        const mainMeals = meals.filter(m => m.isMainMeal);
        if (mainMeals.length === 0) {
            showToast("You haven't marked any meals as 'main'.", 'info');
            return;
        }
        const newTrackedMeals: TrackedMeal[] = mainMeals.map(meal => {
            const scale = meal.defaultWeight / 100;
            return {
                id: crypto.randomUUID(),
                mealId: meal.id,
                name: meal.name,
                weight: meal.defaultWeight,
                calories: Math.round(meal.caloriesPer100g * scale),
                protein: Math.round(meal.proteinPer100g * scale),
                carbs: Math.round(meal.carbsPer100g * scale),
                fat: Math.round(meal.fatPer100g * scale),
                eaten: true,
                category: meal.category,
                imageUrl: meal.imageUrl,
            };
        });
        updateTodaysMealsAndConsumed(prevMeals => [...prevMeals, ...newTrackedMeals]);
        showToast(`${mainMeals.length} main meals added!`, 'success');
    };

    const renderView = () => {
        if (!todaysLog) {
            // Render a loading state or null while the log is being initialized
            return null; 
        }

        switch (view) {
            case 'dashboard':
                return <Dashboard 
                    todaysLog={todaysLog}
                    history={sortedHistory}
                    onQuickAddMeal={handleQuickAddMeal}
                    onRemoveTrackedMeal={handleRemoveTrackedMeal}
                    onSaveDay={handleSaveDay}
                    onToggleEaten={handleToggleEaten}
                    onUpdateWeight={handleUpdateWeight}
                    onTrackAllMainMeals={handleTrackAllMainMeals}
                    onAddMeal={() => setView('meals')}
                />;
            case 'history':
                return <History history={sortedHistory} onDeleteLog={handleDeleteHistoryLog} />;
            case 'meals':
                return <MealList 
                    meals={meals} 
                    onAddMeal={() => setView('addMeal')} 
                    onEditMeal={handleEditMeal} 
                    onDeleteMeal={handleDeleteMeal} 
                    onImportMeals={() => setView('mealExtractor')} 
                    onTrackMeal={handleTrackMeal} 
                    onToggleMainMeal={handleToggleMainMeal}
                />;
            case 'settings':
                return <Settings 
                    currentGoals={goals} 
                    onSaveGoals={setGoals} 
                    theme={theme} 
                    setTheme={setTheme} 
                    accent={accent}
                    setAccent={setAccent}
                    showToast={showToast} 
                />;
            case 'addMeal':
                return <AddMealForm onSave={handleSaveMeal} onCancel={() => setView('meals')} />;
            case 'editMeal':
                return <AddMealForm onSave={handleSaveMeal} onCancel={() => setView('meals')} existingMeal={mealToEdit} />;
            case 'mealExtractor':
                return <MealExtractor onSave={handleSaveExtractedMeals} onCancel={() => setView('meals')} />;
            default:
                return <Dashboard 
                    todaysLog={todaysLog}
                    history={sortedHistory}
                    onQuickAddMeal={handleQuickAddMeal}
                    onRemoveTrackedMeal={handleRemoveTrackedMeal}
                    onSaveDay={handleSaveDay}
                    onToggleEaten={handleToggleEaten}
                    onUpdateWeight={handleUpdateWeight}
                    onTrackAllMainMeals={handleTrackAllMainMeals}
                    onAddMeal={() => setView('meals')}
                />;
        }
    };
    
    const hideNavViews: View[] = ['addMeal', 'editMeal', 'mealExtractor'];
    
    if (!API_KEY) {
        return (
            <div className="flex items-center justify-center min-h-screen p-4 text-center bg-background">
                <div className="bg-card p-8 rounded-2xl shadow-lg max-w-lg animate-fade-in-up">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-danger/10">
                        <Icon name="info" className="h-6 w-6 text-danger" />
                    </div>
                    <h1 className="text-2xl font-bold text-text-primary mt-4">Configuration Error</h1>
                    <p className="text-text-secondary mt-2">
                        The Gemini API key is not configured. The application cannot connect to Google AI services.
                    </p>
                    <div className="mt-6 text-left bg-background p-4 rounded-lg border border-border">
                        <p className="font-semibold text-text-primary">How to fix this:</p>
                        <p className="text-sm text-text-secondary mt-1">
                            You need to set the <code className="bg-border px-1 py-0.5 rounded text-sm font-mono">VITE_GEMINI_API_KEY</code> environment variable on your hosting platform. Please consult your provider's documentation for instructions on how to set environment variables for your deployment.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`font-sans bg-card dark:bg-background text-text-primary min-h-screen`}>
            <div className="relative">
                <AnimatePresence mode="wait">
                    <motion.main
                        key={view}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        className="p-4 pt-8 pb-28 min-h-screen"
                    >
                        {renderView()}
                    </motion.main>
                </AnimatePresence>
            </div>


            {!hideNavViews.includes(view) && (
                 <BottomNav currentView={view} onChangeView={setView} />
            )}
            <Toast {...toast} onClose={() => setToast(prev => ({ ...prev, show: false }))} />
        </div>
    );
};

export default App;
