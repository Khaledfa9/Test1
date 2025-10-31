import React, { useState } from 'react';
import { extractMealsFromFile, generateMealImage, compressImage } from '../services/geminiService';
import { ExtractedMealForReview, Meal, MealCategory } from '../types';
import Icon from './common/Icon';

interface MealExtractorProps {
    onSave: (meals: Meal[]) => void;
    onCancel: () => void;
}

const MealExtractor: React.FC<MealExtractorProps> = ({ onSave, onCancel }) => {
    const [file, setFile] = useState<File | null>(null);
    const [extractedMeals, setExtractedMeals] = useState<ExtractedMealForReview[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [progress, setProgress] = useState(0);
    const [progressText, setProgressText] = useState('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            setFile(e.target.files[0]);
            setError(null);
            setExtractedMeals([]);
        }
    };

    const handleExtract = async () => {
        if (!file) {
            setError('Please select a file first.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setProgress(0);
        try {
            setProgressText('Analyzing diet plan...');
            setProgress(10);
            const rawExtractedMeals = await extractMealsFromFile(file);
            setProgress(50); 
            
            const mealsWithImages: ExtractedMealForReview[] = [];
            for (let i = 0; i < rawExtractedMeals.length; i++) {
                const rawMeal = rawExtractedMeals[i];
                setProgressText(`Generating image for ${rawMeal.mealName}...`);
                const imageUrl = await generateMealImage(rawMeal.mealName);
                const compressedUrl = await compressImage(imageUrl);
                mealsWithImages.push({
                    ...rawMeal,
                    id: crypto.randomUUID(),
                    imageUrl: compressedUrl,
                });
                setProgress(50 + Math.round(((i + 1) / rawExtractedMeals.length) * 50));
            }
            setExtractedMeals(mealsWithImages);
            setProgressText('Done!');
        } catch (err) {
            setError('Failed to extract meals. Please try another file or check the format.');
            console.error(err);
        } finally {
            setIsLoading(false);
            setProgress(100);
        }
    };
    
    const handleMealChange = (id: string, field: keyof ExtractedMealForReview, value: string | number) => {
        setExtractedMeals(prev => prev.map(m => m.id === id ? { ...m, [field]: value } : m));
    };

    const handleSaveAll = () => {
        const mealsToSave: Meal[] = extractedMeals.map(em => {
            const safeWeight = em.weightGrams > 0 ? em.weightGrams : 1;
            return {
                id: crypto.randomUUID(),
                name: em.mealName,
                caloriesPer100g: Math.round(em.calories / (safeWeight / 100)),
                proteinPer100g: Math.round(em.protein / (safeWeight / 100)),
                carbsPer100g: Math.round(em.carbs / (safeWeight / 100)),
                fatPer100g: Math.round(em.fat / (safeWeight / 100)),
                defaultWeight: em.weightGrams,
                category: em.category,
                imageUrl: em.imageUrl,
                isMainMeal: false,
            };
        });
        onSave(mealsToSave);
    };

    return (
        <div className="space-y-6">
            <header className="flex justify-between items-center">
                 <button type="button" onClick={onCancel} className="p-2 rounded-full hover:bg-background">
                    <Icon name="back" className="h-6 w-6 text-text-secondary" />
                </button>
                <h1 className="text-2xl font-bold text-text-primary tracking-tight">Import Meals</h1>
                <div className="w-10"></div>
            </header>
             <p className="text-text-secondary -mt-4 text-center">Extract meals automatically from an image or PDF of your diet plan.</p>

            <div>
                <label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full h-48 px-4 transition bg-background border-2 border-border border-dashed rounded-2xl appearance-none cursor-pointer hover:border-primary focus:outline-none">
                    <div className="flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                        <Icon name="upload" className="w-8 h-8 text-primary" />
                    </div>
                    <span className="font-medium text-text-primary text-center">{file ? file.name : "Tap to browse or drop file"}</span>
                     <span className="text-sm text-text-secondary">{file ? 'Select another file to change' : 'PNG, JPG or PDF'}</span>
                    <input id="file-upload" type="file" className="hidden" onChange={handleFileChange} accept="image/*,application/pdf" />
                </label>
                {file && (
                    <button onClick={handleExtract} disabled={isLoading} className="mt-4 w-full bg-primary text-white font-semibold py-3 px-4 rounded-xl disabled:bg-gray-400">
                        {isLoading ? 'Extracting...' : 'Extract Meals'}
                    </button>
                )}
                 {isLoading && (
                    <div className="mt-4 space-y-2">
                        <div className="w-full bg-border rounded-full h-2.5">
                            <div className="bg-primary h-2.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                        </div>
                        <p className="text-center text-sm text-text-secondary">{progressText}</p>
                    </div>
                 )}
                {error && <p className="text-danger mt-2 text-sm">{error}</p>}
            </div>

            {extractedMeals.length > 0 && (
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold tracking-tight">Review Extracted Meals</h2>
                    {extractedMeals.map(meal => (
                        <div key={meal.id} className="bg-background p-4 rounded-xl space-y-3">
                            <div className="flex items-center space-x-4">
                                <img src={meal.imageUrl} alt={meal.mealName} className="w-16 h-16 rounded-lg object-cover"/>
                                <input value={meal.mealName} onChange={e => handleMealChange(meal.id, 'mealName', e.target.value)} className="w-full text-lg font-bold bg-transparent focus:outline-none focus:bg-card px-2 py-1 rounded-md"/>
                            </div>
                            <div className="grid grid-cols-3 gap-2 text-sm">
                                {Object.entries({calories: 'Cals', protein: 'P', carbs: 'C', fat: 'F', weightGrams: 'g'}).map(([key, label]) => (
                                     <div key={key} className="relative">
                                         <input key={key} type="number" value={meal[key as keyof ExtractedMealForReview]} onChange={e => handleMealChange(meal.id, key as keyof ExtractedMealForReview, parseFloat(e.target.value))} className="p-2 pl-3 rounded-lg bg-card border-2 border-border w-full text-center" placeholder={label}/>
                                         <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-text-secondary">{label}</span>
                                     </div>
                                ))}
                            </div>
                        </div>
                    ))}
                    <button onClick={handleSaveAll} className="w-full bg-success text-white font-semibold py-3 px-4 rounded-xl">
                        Save All Meals
                    </button>
                </div>
            )}
        </div>
    );
};

export default MealExtractor;
