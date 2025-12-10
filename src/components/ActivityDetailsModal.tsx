import React, { useEffect, useState } from 'react';
import { X, Calendar, MapPin, Clock, Activity, Zap, Heart, TrendingUp, Mountain, AlertCircle, CheckCircle, Info } from 'lucide-react';
import axios from 'axios';

interface ActivityDetailsModalProps {
    activity: any | null;
    onClose: () => void;
}

export default function ActivityDetailsModal({ activity, onClose }: ActivityDetailsModalProps) {
    const [analysis, setAnalysis] = useState<any>(null);
    const [loadingAnalysis, setLoadingAnalysis] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (activity) {
            setAnalysis(null);
            setError('');
            // Only analyze if we have HR data
            if (activity.average_heartrate) {
                fetchAnalysis(activity.id);
            }
        }
    }, [activity]);

    const fetchAnalysis = async (id: number) => {
        setLoadingAnalysis(true);
        try {
            const response = await axios.get(`/api/strava/analysis?activityId=${id}`);
            setAnalysis(response.data);
        } catch (err: any) {
            console.error('Analysis fetch failed', err);
            const errorMessage = err.response?.data?.error || 'Analysis unavailable for this activity';
            setError(errorMessage);
        } finally {
            setLoadingAnalysis(false);
        }
    };

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

    const getDriftColor = (drift: number) => {
        if (drift < 3) return 'text-green-600 bg-green-50 border-green-200';
        if (drift < 5) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
        return 'text-red-600 bg-red-50 border-red-200';
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-lg shadow-2xl overflow-hidden relative rounded-xl flex flex-col max-h-[90vh]">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-white/80 hover:text-white z-10 transition-colors"
                >
                    <X className="w-6 h-6" />
                </button>

                {/* Header */}
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white shrink-0">
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

                <div className="p-6 overflow-y-auto">
                    {/* Main Stats Grid */}
                    <div className="grid grid-cols-2 gap-6 mb-8">
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

                    {/* Secondary Stats */}
                    <div className="border-t border-gray-100 pt-6 grid grid-cols-3 gap-4 mb-8">
                        {activity.average_watts && (
                            <div className="flex flex-col">
                                <span className="text-gray-500 text-xs uppercase tracking-wider mb-1 flex items-center gap-1 text-nowrap">
                                    <Zap className="w-3 h-3 text-yellow-500" /> Avg Power
                                </span>
                                <span className="text-lg font-bold text-gray-900">{Math.round(activity.average_watts)} w</span>
                            </div>
                        )}

                        {activity.average_heartrate && (
                            <div className="flex flex-col">
                                <span className="text-gray-500 text-xs uppercase tracking-wider mb-1 flex items-center gap-1 text-nowrap">
                                    <Heart className="w-3 h-3 text-red-500" /> Avg HR
                                </span>
                                <span className="text-lg font-bold text-gray-900">{Math.round(activity.average_heartrate)} bpm</span>
                            </div>
                        )}

                        <div className="flex flex-col">
                            <span className="text-gray-500 text-xs uppercase tracking-wider mb-1 flex items-center gap-1 text-nowrap">
                                <Activity className="w-3 h-3 text-orange-500" /> Calories
                            </span>
                            <span className="text-lg font-bold text-gray-900">{Math.round(activity.kilojoules || activity.calories || 0)}</span>
                        </div>
                    </div>

                    {/* Cardiac Drift Analysis Section */}
                    <div className="border-t border-gray-100 pt-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                <Activity className="w-5 h-5 text-purple-600" />
                                Cardiac Drift Analysis
                            </h3>
                            {loadingAnalysis && <span className="text-xs text-purple-600 animate-pulse font-medium">Analyzing streams...</span>}
                        </div>

                        {loadingAnalysis ? (
                            <div className="bg-gray-50 rounded-lg p-6 flex flex-col items-center justify-center gap-3 animate-pulse">
                                <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
                                <p className="text-sm text-gray-400">Calculating efficiency factor...</p>
                            </div>
                        ) : analysis ? (
                            <div className={`rounded-xl p-5 border ${getDriftColor(analysis.drift)} transition-all`}>
                                <div className="flex items-start justify-between mb-2">
                                    <div>
                                        <div className="text-xs uppercase tracking-wider font-semibold opacity-70 mb-1">Decoupling (Pw:HR)</div>
                                        <div className="text-3xl font-extrabold flex items-center gap-2">
                                            {analysis.drift > 0 ? '+' : ''}{analysis.drift}%
                                            {analysis.drift < 5 ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xs opacity-70">Efficiency Factor</div>
                                        <div className="font-mono text-sm font-bold">
                                            {analysis.ef1} <span className="text-xs font-normal text-gray-500">→</span> {analysis.ef2}
                                        </div>
                                    </div>
                                </div>
                                <p className="text-sm font-medium opacity-90 leading-snug">
                                    {analysis.interpretation}
                                </p>
                            </div>
                        ) : error ? (
                            <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-500 flex items-center gap-2">
                                <Info className="w-4 h-4" />
                                {error}
                            </div>
                        ) : (
                            <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-500 italic">
                                No heart rate data available for analysis.
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}
