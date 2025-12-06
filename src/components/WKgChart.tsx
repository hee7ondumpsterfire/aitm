'use client';

import { useMemo } from 'react';
import { Zap, Activity, TrendingUp, Trophy } from 'lucide-react';

interface Activity {
    start_date: string;
    moving_time: number;
    average_watts?: number;
    weighted_average_watts?: number;
}

interface WKgChartProps {
    ftp: number;
    weight: number;
    activities?: Activity[];
    colorBlindMode?: boolean;
}

const PERCENTILES = [
    { name: 'Untrained', min: 0, max: 2.0, color: 'from-gray-400 to-gray-500' },
    { name: 'Fair', min: 2.0, max: 2.5, color: 'from-green-400 to-green-500' },
    { name: 'Moderate', min: 2.5, max: 3.0, color: 'from-yellow-400 to-yellow-500' },
    { name: 'Good', min: 3.0, max: 3.5, color: 'from-orange-400 to-orange-500' },
    { name: 'Very Good', min: 3.5, max: 4.1, color: 'from-red-400 to-red-500' },
    { name: 'Excellent', min: 4.1, max: 4.7, color: 'from-purple-400 to-purple-500' },
    { name: 'Superior', min: 4.7, max: 6.0, color: 'from-indigo-400 to-indigo-500' },
    { name: 'Elite', min: 6.0, max: 10.0, color: 'from-pink-400 to-pink-500' },
];

export default function WKgChart({ ftp, weight, activities = [], colorBlindMode = false }: WKgChartProps) {
    if (!ftp || !weight) return null;

    const wKg = parseFloat((ftp / weight).toFixed(2));

    // Calculate VO2max Estimate
    // Best formula uses 5-min max power: VO2max = (5min_Power / Weight) * 10.8 + 7
    // Fallback: VO2max = (FTP * 1.2 / Weight) * 10.8 + 7 (Assuming 5min power is ~120% of FTP)
    const vo2Max = useMemo(() => {
        // In a real app, we'd scan activity streams for peak 5min power.
        // Here we'll use a simplified heuristic or fallback.
        // Let's assume for now we don't have granular stream data, so we use the FTP fallback
        // which is a standard estimation method.
        const estimated5MinPower = ftp * 1.2;
        return Math.round((estimated5MinPower / weight) * 10.8 + 7);
    }, [ftp, weight]);

    // Determine current percentile/category
    const currentTierIndex = PERCENTILES.findIndex(p => wKg >= p.min && wKg < p.max);
    const currentTier = currentTierIndex !== -1 ? PERCENTILES[currentTierIndex] : PERCENTILES[PERCENTILES.length - 1];
    const nextTier = PERCENTILES[currentTierIndex + 1];

    // Calculate progress to next tier
    let progress = 0;
    let wattsNeeded = 0;

    if (nextTier) {
        const range = nextTier.min - currentTier.min;
        const currentInTier = wKg - currentTier.min;
        progress = (currentInTier / range) * 100;
        wattsNeeded = Math.round((nextTier.min * weight) - ftp);
    } else {
        progress = 100; // Top tier
    }

    // Colors
    const lineColor = colorBlindMode ? '#0072B2' : '#8b5cf6'; // Blue vs Purple
    const dotColor = colorBlindMode ? '#D55E00' : '#ec4899'; // Vermillion vs Pink
    const areaColor = colorBlindMode ? '#56B4E9' : '#8b5cf6'; // Sky Blue vs Purple (for gradient)

    return (
        <div className="bg-gray-400 p-6 shadow-lg mb-8 rounded-none">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-500" />
                    Power Profile
                </h2>
                <span className={`px-3 py-1 rounded-none text-xs font-bold text-white bg-gradient-to-r ${currentTier.color}`}>
                    {currentTier.name}
                </span>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="bg-gray-300 p-4 rounded-none">
                    <div className="flex items-center gap-2 mb-1">
                        <Activity className="w-4 h-4 text-purple-700" />
                        <span className="text-sm text-gray-700 font-medium">Power/Weight</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold text-gray-900">{wKg}</span>
                        <span className="text-sm text-gray-600">W/kg</span>
                    </div>
                </div>
                <div className="bg-gray-300 p-4 rounded-none">
                    <div className="flex items-center gap-2 mb-1">
                        <TrendingUp className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-gray-700 font-medium">Est. VO2max</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold text-gray-900">{vo2Max}</span>
                        <span className="text-sm text-gray-600">ml/kg/min</span>
                    </div>
                </div>
            </div>

            {nextTier && (
                <div>
                    <div className="flex justify-between items-end mb-2">
                        <div>
                            <span className="text-sm font-semibold text-gray-800 block mb-1">Next Level: {nextTier.name}</span>
                            <span className="text-xs text-gray-600">
                                +{wattsNeeded} watts needed to reach {nextTier.min} W/kg
                            </span>
                        </div>
                        <Trophy className="w-5 h-5 text-yellow-500" />
                    </div>
                    <div className="h-3 w-full bg-gray-300 rounded-none overflow-hidden">
                        <div
                            className={`h-full bg-gradient-to-r ${currentTier.color} transition-all duration-1000 ease-out`}
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                    <div className="flex justify-between mt-1 text-xs text-gray-600">
                        <span>{currentTier.min} W/kg</span>
                        <span>{nextTier.min} W/kg</span>
                    </div>
                </div>
            )}
        </div>
    );
}
