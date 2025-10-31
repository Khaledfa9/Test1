import React, { useCallback } from 'react';
import useLocalStorage from './useLocalStorage';
import { DailyGoals } from '../types';

const DEFAULT_GOALS: DailyGoals = {
    calories: 2000,
    protein: 150,
    carbs: 200,
    fat: 60,
};

export function useDailyGoals() {
    const [allDailyGoals, setAllDailyGoals] = useLocalStorage<Record<string, DailyGoals>>(
        'allDailyGoals',
        {}
    );

    const getGoalsForDate = useCallback((date: Date): DailyGoals => {
        const dateString = date.toDateString();
        if (allDailyGoals[dateString]) {
            return allDailyGoals[dateString];
        }

        const sortedDates = Object.keys(allDailyGoals).sort(
            (a, b) => new Date(b).getTime() - new Date(a).getTime()
        );

        if (sortedDates.length > 0) {
            return allDailyGoals[sortedDates[0]];
        }

        return DEFAULT_GOALS;
    }, [allDailyGoals]);

    const getTodaysGoals = useCallback((): DailyGoals => {
        return getGoalsForDate(new Date());
    }, [getGoalsForDate]);

    const setTodaysGoals = (newGoals: DailyGoals) => {
        const todayString = new Date().toDateString();
        setAllDailyGoals(prev => ({
            ...prev,
            [todayString]: newGoals,
        }));
    };

    return { allDailyGoals, setAllDailyGoals, getGoalsForDate, getTodaysGoals, setTodaysGoals };
}
