import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { HistoryLog } from '../../types';

interface WeeklyBalanceChartProps {
    history: HistoryLog[];
}

const WeeklyBalanceChart: React.FC<WeeklyBalanceChartProps> = ({ history }) => {
    // This is a basic implementation. A real-world scenario might involve
    // more complex date handling (e.g., using a library like date-fns)
    // to ensure correctness across timezones and locales.
    const last7DaysData = React.useMemo(() => {
        const data = [];
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            const isoDateString = date.toISOString().split('T')[0];

            const log = history.find(h => h.isoDate.startsWith(isoDateString));
            
            data.push({
                name: date.toLocaleDateString('en-US', { weekday: 'short' }),
                calories: log ? log.consumed.calories : 0,
                goal: log ? log.goals.calories : 2000, // Assume default goal if no log
            });
        }
        return data;
    }, [history]);
    
    // Note: Recharts is an external library. This component assumes it's available
    // in the environment, as suggested by the project's README.
    // An import map has been added to index.html to support this.
    return (
        <div className="bg-card p-4 rounded-2xl shadow-sm">
             <h3 className="text-lg font-bold text-text-primary mb-4 px-2">Weekly Summary</h3>
            <ResponsiveContainer width="100%" height={200}>
                <BarChart data={last7DaysData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <XAxis dataKey="name" stroke="rgb(var(--color-text-secondary))" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="rgb(var(--color-text-secondary))" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip
                        cursor={{ fill: 'rgba(var(--color-border), 0.5)' }}
                        contentStyle={{
                            background: 'rgb(var(--color-card))',
                            border: '1px solid rgb(var(--color-border))',
                            borderRadius: '0.75rem',
                            color: 'rgb(var(--color-text-primary))'
                        }}
                    />
                    <Bar dataKey="calories" name="Calories" radius={[4, 4, 0, 0]}>
                         {last7DaysData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.calories > entry.goal ? 'rgb(var(--color-danger))' : 'rgb(var(--color-primary))'} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default WeeklyBalanceChart;