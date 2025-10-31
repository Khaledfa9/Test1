import React from 'react';

interface MacroBarProps {
    label: string;
    value: number;
    goal: number;
    color: string;
}

const MacroBar: React.FC<MacroBarProps> = ({ label, value, goal, color }) => {
    const percentage = goal > 0 ? (value / goal) * 100 : 0;
    const displayPercentage = Math.min(percentage, 100);
    const remaining = goal - value;
    const isOver = remaining < 0;

    return (
        <div className="bg-background p-3 rounded-xl text-center space-y-1.5">
            <div className="flex justify-center items-center px-1">
                 <p className="text-sm font-semibold text-text-primary">{label}</p>
            </div>
            <div className="bg-border rounded-full h-1.5 w-full overflow-hidden">
                <div 
                    className={`${isOver ? 'bg-danger' : color} h-1.5 rounded-full transition-all duration-500`} 
                    style={{ width: `${displayPercentage}%` }}
                ></div>
            </div>
            <p className={`text-xs font-medium transition-colors duration-300 ${isOver ? 'text-danger' : 'text-text-secondary'}`}>
                {isOver ? `${Math.round(Math.abs(remaining))}g over` : `${Math.round(remaining)}g left`}
            </p>
        </div>
    );
};

export default MacroBar;