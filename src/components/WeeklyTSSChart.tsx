'use client';

import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line, ComposedChart } from 'recharts';
import { startOfWeek, endOfWeek, subWeeks, isWithinInterval, parseISO, format } from 'date-fns';

interface Activity {
    start_date: string;
    moving_time: number;
    average_watts?: number;
    weighted_average_watts?: number;
    average_heartrate?: number;
    type: string;
}

interface WeeklyTSSChartProps {
    activities: Activity[];
    ftp: number;
    maxHr: number;
    colorBlindMode?: boolean;
}

export default function WeeklyTSSChart({ activities, ftp, maxHr, colorBlindMode = false }: WeeklyTSSChartProps) {
    const [metric, setMetric] = useState<'tss' | 'hrtss'>('tss');

    const tssColor = colorBlindMode ? '#0072B2' : '#8b5cf6'; // Blue vs Purple
    const hrTssColor = colorBlindMode ? '#D55E00' : '#ec4899'; // Vermillion vs Pink
    const trendColor = colorBlindMode ? '#000000' : '#f59e0b'; // Black vs Amber/Orange for trend

    // 1. Define the last 5 weeks (Current + 4 previous)
    const weeks = [];
    const today = new Date();

    // Start from 8 weeks ago up to current week
    for (let i = 8; i >= 0; i--) {
        const date = subWeeks(today, i);
        const start = startOfWeek(date, { weekStartsOn: 1 }); // Monday start
        const end = endOfWeek(date, { weekStartsOn: 1 });
        weeks.push({ start, end, label: i === 0 ? 'Current' : `-${i}w` });
    }

    // 2. Calculate TSS/hrTSS for each activity and aggregate by week
    const data = weeks.map(week => {
        const weeklyScore = activities.reduce((total, activity) => {
            const activityDate = parseISO(activity.start_date);

            if (isWithinInterval(activityDate, { start: week.start, end: week.end })) {
                let score = 0;
                const durationSeconds = activity.moving_time;

                if (metric === 'tss') {
                    // Power-based TSS
                    const power = activity.weighted_average_watts || activity.average_watts;
                    if (power && ftp > 0) {
                        // TSS = (sec * NP * IF) / (FTP * 3600) * 100
                        const intensityFactor = power / ftp;
                        score = (durationSeconds * power * intensityFactor) / (ftp * 3600) * 100;
                    }
                } else {
                    // Heart Rate-based hrTSS (Estimated)
                    // hrTSS ~= (duration_sec / 3600) * (avg_hr / LTHR)^2 * 100
                    // We use Max HR proxy: LTHR ~= 0.9 * Max HR
                    const hr = activity.average_heartrate;
                    if (hr && maxHr > 0) {
                        const estimatedLTR = maxHr * 0.9; // Estimate LTHR
                        const intensityFactor = hr / estimatedLTR;
                        score = (durationSeconds / 3600) * (intensityFactor * intensityFactor) * 100;
                    }
                }

                return total + score;
            }
            return total;
        }, 0);

        return {
            name: week.label,
            dateRange: `${format(week.start, 'MMM d')} - ${format(week.end, 'MMM d')}`,
            score: Math.round(weeklyScore),
        };
    });

    // 3. Calculate Trendline (Simple Linear Regression)
    // We want to ignore the current week (last item) for the trend calculation
    // So we use data.slice(0, n-1)
    const trendData = data.slice(0, data.length - 1);
    const n = trendData.length;
    let sumX = 0;
    let sumY = 0;
    let sumXY = 0;
    let sumXX = 0;

    trendData.forEach((point, i) => {
        sumX += i;
        sumY += point.score;
        sumXY += i * point.score;
        sumXX += i * i;
    });

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    const dataWithTrend = data.map((point, i) => ({
        ...point,
        trend: Math.round(slope * i + intercept)
    }));

    return (
        <div className="bg-gray-400 p-6 shadow-lg mb-8 rounded-none">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">Weekly Training Stress</h2>
                    <p className="text-xs text-gray-600">
                        {metric === 'tss' ? 'Based on Power (TSS)' : 'Based on Heart Rate (hrTSS)'}
                    </p>
                </div>
                <select
                    value={metric}
                    onChange={(e) => setMetric(e.target.value as 'tss' | 'hrtss')}
                    className="bg-gray-300 border-none text-gray-800 text-sm rounded-none px-2 py-1 focus:ring-2 focus:ring-purple-500 cursor-pointer"
                >
                    <option value="tss">TSS</option>
                    <option value="hrtss">hrTSS</option>
                </select>
            </div>

            <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart
                        data={dataWithTrend}
                        margin={{
                            top: 10,
                            right: 10,
                            left: 0,
                            bottom: 0,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                        <XAxis
                            dataKey="name"
                            stroke="#4b5563"
                            tick={{ fill: '#4b5563', fontSize: 12 }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis
                            stroke="#4b5563"
                            tick={{ fill: '#4b5563', fontSize: 12 }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#fff', borderRadius: '0px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                            labelStyle={{ color: '#111827', fontWeight: 'bold', marginBottom: '4px' }}
                            formatter={(value: number, name: string) => [value, name === 'score' ? (metric === 'tss' ? 'TSS' : 'hrTSS') : 'Trend']}
                        />
                        <Bar dataKey="score" fill={metric === 'tss' ? tssColor : hrTssColor} radius={[4, 4, 0, 0]} barSize={30} />
                        <Line type="monotone" dataKey="trend" stroke={trendColor} strokeWidth={2} dot={false} />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
