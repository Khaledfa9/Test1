import React from 'react';

interface CircularProgressProps {
    percentage: number;
    size?: number;
    strokeWidth?: number;
    color?: string;
    overColor?: string;
    label: string;
    value: number;
    goal: number;
}

const CircularProgress: React.FC<CircularProgressProps> = ({
    percentage,
    size = 120,
    strokeWidth = 10,
    color = 'rgb(var(--color-primary))',
    overColor = 'rgb(var(--color-danger))',
    label,
    value,
    goal,
}) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const isOver = percentage > 100;
    
    const mainPercentage = Math.min(percentage, 100);
    const mainOffset = circumference - (mainPercentage / 100) * circumference;

    const overPercentage = isOver ? percentage - 100 : 0;
    const overOffset = circumference - (overPercentage / 100) * circumference;

    return (
        <div className="flex flex-col items-center justify-center gap-1">
            <div className="relative" style={{ width: size, height: size }}>
                <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
                    <circle
                        stroke="rgb(var(--color-border))"
                        fill="transparent"
                        strokeWidth={strokeWidth}
                        r={radius}
                        cx={size / 2}
                        cy={size / 2}
                    />
                    <circle
                        stroke={color}
                        fill="transparent"
                        strokeWidth={strokeWidth}
                        strokeDasharray={circumference}
                        style={{ strokeDashoffset: mainOffset }}
                        strokeLinecap="round"
                        r={radius}
                        cx={size / 2}
                        cy={size / 2}
                        className="transition-all duration-700 ease-out"
                    />
                    {isOver && (
                        <circle
                            stroke={overColor}
                            fill="transparent"
                            strokeWidth={strokeWidth}
                            strokeDasharray={circumference}
                            style={{ strokeDashoffset: overOffset }}
                            strokeLinecap="round"
                            r={radius}
                            cx={size / 2}
                            cy={size / 2}
                            className="transition-all duration-700 ease-out"
                        />
                    )}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`text-3xl font-bold tracking-tight text-text-primary`}>
                       {Math.round(value)}
                    </span>
                    <span className="text-sm text-text-secondary">/ {goal} kcal</span>
                </div>
            </div>
             <p className="text-lg font-semibold text-text-primary mt-2">{label}</p>
             <p className={`text-sm font-semibold -mt-1 ${isOver ? 'text-danger' : 'text-text-secondary'}`}>{Math.round(goal-value)} remaining</p>
        </div>
    );
};

export default CircularProgress;