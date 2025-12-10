
import React, { useState } from 'react';
import { Clock, Bike, Download, Check, AlertCircle } from 'lucide-react';
import axios from 'axios';

interface WorkoutSegment {
    segment_type: string;
    duration_minutes: number;
    intensity_pct_ftp: number;
}

export interface Workout {
    day: string;
    activity_name: string;
    duration: string;
    description: string;
    type: string;
    structure: WorkoutSegment[];
}

interface WorkoutCardProps {
    workout: Workout;
    userSettings: { ftp: number; maxHr: number };
}

export default function WorkoutCard({ workout, userSettings }: WorkoutCardProps) {
    const [exporting, setExporting] = useState(false);
    const [exportSuccess, setExportSuccess] = useState(false);

    const isRide = workout.type === 'Ride' || workout.activity_name.toLowerCase().includes('ride') || workout.activity_name.toLowerCase().includes('cycle');
    const hasStructure = workout.structure && workout.structure.length > 0;

    const handleExport = async () => {
        if (!isRide) return;
        setExporting(true);
        try {
            const response = await axios.post('/api/ai/zwo', {
                workoutName: workout.activity_name,
                workoutDescription: workout.description,
                ftp: userSettings.ftp,
                maxHr: userSettings.maxHr
            });

            const { xmlContent, filename } = response.data;

            const blob = new Blob([xmlContent], { type: 'application/xml' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            setExportSuccess(true);
            setTimeout(() => setExportSuccess(false), 3000);
        } catch (error) {
            console.error('Export failed', error);
            alert('Failed to export workout.');
        } finally {
            setExporting(false);
        }
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 hover:shadow-md transition-shadow group">
            {/* Header */}
            <div className="flex justify-between items-start mb-3">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{workout.day}</span>
                        {workout.type && (
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${workout.type === 'Rest' ? 'bg-gray-100 text-gray-600' : 'bg-purple-100 text-purple-700'
                                }`}>
                                {workout.type}
                            </span>
                        )}
                    </div>
                    <h3 className="font-bold text-gray-900 leading-tight">{workout.activity_name}</h3>
                </div>

                {/* Duration Badge */}
                <div className="flex items-center gap-1 text-xs font-medium bg-gray-100 text-gray-600 px-2 py-1 rounded-md">
                    <Clock className="w-3 h-3" />
                    {workout.duration}
                </div>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">{workout.description}</p>

            {/* Mini Chart (Visual Structure) */}
            {hasStructure && (
                <div className="mb-4">
                    <div className="text-[10px] text-gray-400 font-bold mb-1 uppercase tracking-wider">Interval Structure</div>
                    <div className="h-16 flex items-end gap-0.5 w-full bg-gray-50 rounded-md p-2 border border-gray-100 relative overflow-hidden">
                        {workout.structure.map((seg, idx) => {
                            // Calculate height based on intensity (0.5 to 1.5 range typically)
                            // Cap at 100% height for 150% FTP
                            const heightPct = Math.min(100, Math.max(10, (seg.intensity_pct_ftp / 1.5) * 100));

                            // Color based on intensity
                            let colorClass = 'bg-gray-400'; // Warmup/Recovery
                            if (seg.intensity_pct_ftp >= 0.85 && seg.intensity_pct_ftp < 1.0) colorClass = 'bg-yellow-400'; // Sweetspot
                            if (seg.intensity_pct_ftp >= 1.0) colorClass = 'bg-orange-500'; // Threshold
                            if (seg.intensity_pct_ftp >= 1.1) colorClass = 'bg-red-500'; // VO2
                            if (seg.intensity_pct_ftp <= 0.6) colorClass = 'bg-blue-300'; // Recovery
                            if (seg.intensity_pct_ftp <= 0.75 && seg.intensity_pct_ftp > 0.6) colorClass = 'bg-green-400'; // Endurance

                            return (
                                <div
                                    key={idx}
                                    className={`${colorClass} rounded-t-sm transition-all hover:opacity-80`}
                                    style={{
                                        height: `${heightPct}%`,
                                        width: `${Math.max(5, (seg.duration_minutes / 60) * 100)}%`, // Rough width relative to hour? No, simple flex-grow or fixed proportion
                                        flexGrow: seg.duration_minutes
                                    }}
                                    title={`${seg.segment_type}: ${seg.duration_minutes}m @ ${Math.round(seg.intensity_pct_ftp * 100)}% FTP`}
                                ></div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Actions */}
            <div className="flex justify-end pt-2 border-t border-gray-100">
                {isRide && (
                    <button
                        onClick={handleExport}
                        disabled={exporting}
                        className={`
                            flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all
                            ${exportSuccess
                                ? 'bg-green-100 text-green-700'
                                : 'bg-orange-50 text-orange-600 hover:bg-orange-100 hover:text-orange-700'}
                        `}
                        title="Export to Zwift (.zwo)"
                    >
                        {exportSuccess ? (
                            <> <Check className="w-3.5 h-3.5" /> Exported </>
                        ) : exporting ? (
                            <> <div className="w-3 h-3 border-2 border-orange-600 border-t-transparent rounded-full animate-spin"></div> processing... </>
                        ) : (
                            <> <Download className="w-3.5 h-3.5" /> Zwift </>
                        )}
                    </button>
                )}
            </div>
        </div>
    );
}
