'use client';

import { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Activity {
    type: string;
    distance: number;
    moving_time: number;
}

interface ActivityPieChartProps {
    activities: Activity[];
    colorBlindMode?: boolean;
}

// Dark Grey to Purple Gradient
const COLORS = ['#4B5563', '#6B7280', '#7C3AED', '#8B5CF6', '#A78BFA', '#C4B5FD'];
const COLORS_CB = ['#E69F00', '#56B4E9', '#009E73', '#F0E442', '#0072B2', '#D55E00']; // Okabe-Ito

export default function ActivityPieChart({ activities, colorBlindMode = false }: ActivityPieChartProps) {
    const [sortBy, setSortBy] = useState<'distance' | 'time'>('distance');

    const currentColors = colorBlindMode ? COLORS_CB : COLORS;

    // Process data based on selected metric
    const data = activities.reduce((acc: any[], activity) => {
        const existing = acc.find(item => item.name === activity.type);
        const value = sortBy === 'distance' ? activity.distance : activity.moving_time;

        if (existing) {
            existing.value += value;
        } else {
            acc.push({ name: activity.type, value: value });
        }
        return acc;
    }, []).map(item => ({
        ...item,
        value: sortBy === 'distance'
            ? parseFloat((item.value / 1000).toFixed(2)) // km
            : parseFloat((item.value / 60).toFixed(2))   // min
    })).sort((a, b) => b.value - a.value); // Sort descending

    if (data.length === 0) {
        return null;
    }

    return (
        <div className="bg-gray-400 p-6 shadow-lg mb-8 rounded-none">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Activity Distribution</h2>
                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'distance' | 'time')}
                    className="bg-gray-300 border-none text-gray-800 text-sm rounded-none px-3 py-1 focus:ring-2 focus:ring-purple-500"
                >
                    <option value="distance">By Distance (km)</option>
                    <option value="time">By Time (min)</option>
                </select>
            </div>
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }: { name?: string, percent?: number }) => `${name || ''} ${(percent ? percent * 100 : 0).toFixed(0)}%`}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={currentColors[index % currentColors.length]} />
                            ))}
                        </Pie>
                        <Tooltip formatter={(value: number) => [`${value} ${sortBy === 'distance' ? 'km' : 'min'}`, sortBy === 'distance' ? 'Distance' : 'Time']} />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
