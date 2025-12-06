import React from 'react';
import { X, Calendar, MapPin, Clock, Activity, Zap, Heart, TrendingUp, Mountain } from 'lucide-react';

interface ActivityDetailsModalProps {
    activity: any | null;
    onClose: () => void;
}

export default function ActivityDetailsModal({ activity, onClose }: ActivityDetailsModalProps) {
    if (!activity) return null;

    // Helper to format duration
    const formatDuration = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h > 0 ? `${h}h ` : ''}${m}m ${s}s`;
    };

    // Helper to format speed (m/s to km/h or min/km)
    const formatSpeed = (speed: number, type: string) => {
        if (type === 'Run' || type === 'Hike' || type === 'Walk') {
            // Pace (min/km)
            if (speed === 0) return '0:00 /km';
            const minPerKm = 16.6667 / speed;
            const min = Math.floor(minPerKm);
            const sec = Math.round((minPerKm - min) * 60);
            return `${min}:${sec.toString().padStart(2, '0')} /km`;
        } else {
            // Speed (km/h)
            return `${(speed * 3.6).toFixed(1)} km/h`;
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white w-full max-w-lg shadow-2xl overflow-hidden relative rounded-lg">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10"
                >
                    <X className="w-6 h-6" />
                </button>

                {/* Header with Map Placeholder or Activity Type Icon */}
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white">
                    <div className="flex items-center gap-2 mb-2 opacity-80 text-sm uppercase tracking-wider font-semibold">
                        <Activity className="w-4 h-4" />
                        {activity.type}
                    </div>
                    <h2 className="text-2xl font-bold leading-tight">{activity.name}</h2>
                    <div className="flex items-center gap-2 mt-2 text-purple-100 text-sm">
                        <Calendar className="w-4 h-4" />
                        {new Date(activity.start_date).toLocaleDateString(undefined, {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </div>
                </div>

                <div className="p-6">
                    <div className="grid grid-cols-2 gap-6 mb-6">
                        <div className="flex flex-col">
                            <span className="text-gray-500 text-xs uppercase tracking-wider mb-1 flex items-center gap-1">
                                <Clock className="w-3 h-3" /> Time
                            </span>
                            <span className="text-xl font-bold text-gray-900">{formatDuration(activity.moving_time)}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-gray-500 text-xs uppercase tracking-wider mb-1 flex items-center gap-1">
                                <MapPin className="w-3 h-3" /> Distance
                            </span>
                            <span className="text-xl font-bold text-gray-900">{(activity.distance / 1000).toFixed(2)} km</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-gray-500 text-xs uppercase tracking-wider mb-1 flex items-center gap-1">
                                <Mountain className="w-3 h-3" /> Elevation
                            </span>
                            <span className="text-xl font-bold text-gray-900">{activity.total_elevation_gain} m</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-gray-500 text-xs uppercase tracking-wider mb-1 flex items-center gap-1">
                                <TrendingUp className="w-3 h-3" /> Avg Speed/Pace
                            </span>
                            <span className="text-xl font-bold text-gray-900">{formatSpeed(activity.average_speed, activity.type)}</span>
                        </div>
                    </div>

                    <div className="border-t border-gray-100 pt-6 grid grid-cols-2 gap-6">
                        {activity.average_watts && (
                            <div className="flex flex-col">
                                <span className="text-gray-500 text-xs uppercase tracking-wider mb-1 flex items-center gap-1">
                                    <Zap className="w-3 h-3 text-yellow-500" /> Avg Power
                                </span>
                                <span className="text-xl font-bold text-gray-900">{Math.round(activity.average_watts)} w</span>
                                {activity.weighted_average_watts && (
                                    <span className="text-xs text-gray-500">NP: {Math.round(activity.weighted_average_watts)} w</span>
                                )}
                            </div>
                        )}

                        {activity.average_heartrate && (
                            <div className="flex flex-col">
                                <span className="text-gray-500 text-xs uppercase tracking-wider mb-1 flex items-center gap-1">
                                    <Heart className="w-3 h-3 text-red-500" /> Avg HR
                                </span>
                                <span className="text-xl font-bold text-gray-900">{Math.round(activity.average_heartrate)} bpm</span>
                                {activity.max_heartrate && (
                                    <span className="text-xs text-gray-500">Max: {Math.round(activity.max_heartrate)} bpm</span>
                                )}
                            </div>
                        )}

                        <div className="flex flex-col">
                            <span className="text-gray-500 text-xs uppercase tracking-wider mb-1 flex items-center gap-1">
                                <Activity className="w-3 h-3 text-orange-500" /> Calories
                            </span>
                            <span className="text-xl font-bold text-gray-900">{Math.round(activity.kilojoules || activity.calories || 0)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
