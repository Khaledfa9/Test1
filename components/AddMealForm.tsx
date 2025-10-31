import React, { useState, useEffect, useMemo } from 'react';
import { Meal, MealCategory } from '../types';
import { generateMealImage, compressImage } from '../services/geminiService';
import Icon from './common/Icon';

interface AddMealFormProps {
    onSave: (meal: Meal) => void;
    onCancel: () => void;
    existingMeal?: Meal;
}

type MealFormState = {
    name: string;
    calories: string;
    protein: string;
    carbs: string;
    fat: string;
    servingWeight: string; 
    category: MealCategory;
    imageUrl: string;
    isMainMeal: boolean;
};

const mealToFormState = (meal: Meal): MealFormState => {
    const scale = meal.defaultWeight / 100;
    return {
        name: meal.name,
        calories: String(Math.round(meal.caloriesPer100g * scale)),
        protein: String(Math.round(meal.proteinPer100g * scale)),
        carbs: String(Math.round(meal.carbsPer100g * scale)),
        fat: String(Math.round(meal.fatPer100g * scale)),
        servingWeight: String(meal.defaultWeight),
        category: meal.category,
        imageUrl: meal.imageUrl,
        isMainMeal: meal.isMainMeal,
    };
};

const emptyFormState: MealFormState = {
    name: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    servingWeight: '100',
    category: MealCategory.Snacks,
    imageUrl: '',
    isMainMeal: false,
};


const AddMealForm: React.FC<AddMealFormProps> = ({ onSave, onCancel, existingMeal }) => {
    const [formState, setFormState] = useState<MealFormState>(
        existingMeal ? mealToFormState(existingMeal) : emptyFormState
    );
    const [isGeneratingImage, setIsGeneratingImage] = useState(false);

    useEffect(() => {
        setFormState(existingMeal ? mealToFormState(existingMeal) : emptyFormState);
    }, [existingMeal]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        
        if (type === 'checkbox') {
            const { checked } = e.target as HTMLInputElement;
            setFormState(prev => ({ ...prev, [name]: checked }));
        } else {
            if (type === 'number' && value !== '' && !/^\d*\.?\d*$/.test(value)) {
                return;
            }
            setFormState(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleGenerateImage = async () => {
        if (!formState.name) return;
        setIsGeneratingImage(true);
        try {
            const imageUrl = await generateMealImage(formState.name);
            const compressedUrl = await compressImage(imageUrl);
            setFormState(prev => ({ ...prev, imageUrl: compressedUrl }));
        } catch (error) {
            console.error("Failed to generate image", error);
        } finally {
            setIsGeneratingImage(false);
        }
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const servingWeight = parseFloat(formState.servingWeight) || 0;
        const calories = parseFloat(formState.calories) || 0;
        const protein = parseFloat(formState.protein) || 0;
        const carbs = parseFloat(formState.carbs) || 0;
        const fat = parseFloat(formState.fat) || 0;

        const safeServingWeight = servingWeight > 0 ? servingWeight : 1;

        const mealToSave: Meal = {
            id: existingMeal?.id || crypto.randomUUID(),
            name: formState.name,
            caloriesPer100g: Math.round((calories / safeServingWeight) * 100),
            proteinPer100g: Math.round((protein / safeServingWeight) * 100),
            carbsPer100g: Math.round((carbs / safeServingWeight) * 100),
            fatPer100g: Math.round((fat / safeServingWeight) * 100),
            defaultWeight: servingWeight,
            category: formState.category,
            imageUrl: formState.imageUrl,
            isMainMeal: formState.isMainMeal,
        };
        onSave(mealToSave);
    };

    const isEditMode = !!existingMeal;
    
    const per100gValues = useMemo(() => {
        const servingWeight = parseFloat(formState.servingWeight) || 0;
        if (servingWeight <= 0) return { cals: 0, p: 0, c: 0, f: 0 };
        
        const calories = parseFloat(formState.calories) || 0;
        const protein = parseFloat(formState.protein) || 0;
        const carbs = parseFloat(formState.carbs) || 0;
        const fat = parseFloat(formState.fat) || 0;

        return {
            cals: Math.round((calories / servingWeight) * 100),
            p: Math.round((protein / servingWeight) * 100),
            c: Math.round((carbs / servingWeight) * 100),
            f: Math.round((fat / servingWeight) * 100),
        }
    }, [formState]);


    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <header className="flex justify-between items-center">
                <button type="button" onClick={onCancel} className="p-2 rounded-full hover:bg-background">
                    <Icon name="back" className="h-6 w-6 text-text-secondary" />
                </button>
                <h1 className="text-2xl font-bold text-text-primary tracking-tight">{isEditMode ? 'Edit Meal' : 'Add Meal'}</h1>
                <div className="w-10"></div>
            </header>

            <div className="space-y-6">
                <div className="relative w-full aspect-[4/3] bg-background rounded-2xl flex items-center justify-center border border-border overflow-hidden">
                    {isGeneratingImage && (
                        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 overflow-hidden">
                             <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 dark:via-white/10 to-transparent -translate-x-full animate-shimmer"></div>
                        </div>
                    )}
                    {formState.imageUrl ? (
                        <img src={formState.imageUrl} alt={formState.name} className="w-full h-full object-cover" />
                    ) : (
                        <Icon name="food" className="w-16 h-16 text-text-secondary/50" />
                    )}
                     <button type="button" onClick={handleGenerateImage} disabled={isGeneratingImage || !formState.name} className="absolute bottom-4 right-4 bg-primary text-white px-4 py-2.5 rounded-full font-semibold flex items-center space-x-2 disabled:bg-gray-400 shadow-lg">
                        <Icon name="camera" className="w-5 h-5" />
                        <span>{isGeneratingImage ? 'Generating...' : 'Generate'}</span>
                    </button>
                </div>
                <div>
                    <label className="block text-sm font-medium text-text-secondary px-1">Meal Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formState.name}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full px-4 py-3 bg-background border-2 border-border rounded-xl shadow-sm focus:outline-none focus:border-primary focus:ring-0"
                    />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-text-secondary px-1">Calories</label>
                        <input type="number" name="calories" value={formState.calories} onChange={handleChange} className="mt-1 block w-full px-4 py-3 bg-background border-2 border-border rounded-xl"/>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-text-secondary px-1">Serving Weight (g)</label>
                        <input type="number" name="servingWeight" value={formState.servingWeight} onChange={handleChange} className="mt-1 block w-full px-4 py-3 bg-background border-2 border-border rounded-xl"/>
                    </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-text-secondary px-1">Protein</label>
                        <input type="number" name="protein" value={formState.protein} onChange={handleChange} className="mt-1 block w-full px-4 py-3 bg-background border-2 border-border rounded-xl"/>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-text-secondary px-1">Carbs</label>
                        <input type="number" name="carbs" value={formState.carbs} onChange={handleChange} className="mt-1 block w-full px-4 py-3 bg-background border-2 border-border rounded-xl"/>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-text-secondary px-1">Fat</label>
                        <input type="number" name="fat" value={formState.fat} onChange={handleChange} className="mt-1 block w-full px-4 py-3 bg-background border-2 border-border rounded-xl"/>
                    </div>
                </div>
                
                <div className="text-sm text-center text-text-secondary p-3 bg-background rounded-xl border-2 border-border">
                    Per 100g: {per100gValues.cals}kcal, {per100gValues.p}g P, {per100gValues.c}g C, {per100gValues.f}g F
                </div>

                <div>
                    <label className="block text-sm font-medium text-text-secondary px-1">Category</label>
                    <select
                        name="category"
                        value={formState.category}
                        onChange={handleChange}
                        className="mt-1 block w-full px-4 py-3 bg-background border-2 border-border rounded-xl"
                    >
                        {Object.values(MealCategory).map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
                
                <div className="flex items-center p-4 bg-background rounded-xl">
                    <input
                        type="checkbox"
                        id="isMainMeal"
                        name="isMainMeal"
                        checked={formState.isMainMeal}
                        onChange={handleChange}
                        className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <label htmlFor="isMainMeal" className="ml-3 block text-sm font-medium text-text-primary">
                        Set as a main meal
                    </label>
                </div>
            </div>

            <div className="flex justify-end space-x-3">
                <button type="button" onClick={onCancel} className="px-6 py-3 rounded-xl bg-border text-text-primary font-semibold">Cancel</button>
                <button type="submit" className="px-6 py-3 rounded-xl bg-primary text-white font-semibold">{isEditMode ? 'Save Changes' : 'Save Meal'}</button>
            </div>
        </form>
    );
};

export default AddMealForm;