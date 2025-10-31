import React from 'react';
import { TodayLog } from '../../types';

interface MacroSummaryProps {
    consumed: TodayLog['consumed'];
    goals: TodayLog['goals'];
}

const MacroBar: React.FC<{
    label: string;
    value: number;
    goal: number;
    color: string;
}> = ({ label, value, goal, color }) => {
    const percentage = goal > 0 ? (value / goal) * 100 : 0;
    const displayPercentage = Math.min(percentage, 100);

    return (
        <div>
            <div className="flex justify-between items-baseline mb-1">
                <span className="text-sm font-medium text-text-primary">{label}</span>
                <span className="text-xs text-text-secondary">{Math.round(value)}/{goal}g</span>
            </div>
            <div className="bg-border rounded-full h-2 w-full overflow-hidden">
                <div 
                    className={`${color} h-2 rounded-full transition-all duration-500`} 
                    style={{ width: `${displayPercentage}%` }}
                ></div>
            </div>
        </div>
    );
};


const MacroSummary: React.FC<MacroSummaryProps> = ({ consumed, goals }) => {
    return (
        <div className="bg-background p-4 rounded-2xl space-y-4">
            <MacroBar label="Protein" value={consumed.protein} goal={goals.protein} color="bg-info" />
            <MacroBar label="Carbs" value={consumed.carbs} goal={goals.carbs} color="bg-danger" />
            <MacroBar label="Fat" value={consumed.fat} goal={goals.fat} color="bg-warning" />
        </div>
    );
};

export default MacroSummary;