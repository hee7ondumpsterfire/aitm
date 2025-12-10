
import React, { useState } from 'react';
import { Download, X, Bike, AlertCircle } from 'lucide-react';
import axios from 'axios';

interface ZwiftExportModalProps {
    isOpen: boolean;
    onClose: () => void;
    planMarkdown: string | null;
    userSettings: { ftp: number; maxHr: number };
}

interface ParsedWorkout {
    day: string;
    name: string;
    duration: string;
    description: string;
}

export default function ZwiftExportModal({ isOpen, onClose, planMarkdown, userSettings }: ZwiftExportModalProps) {
    const [generating, setGenerating] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    // Helper to parse markdown table
    const parseWorkouts = (md: string | null): ParsedWorkout[] => {
        if (!md) return [];
        const lines = md.split('\n');
        const workouts: ParsedWorkout[] = [];

        let inTable = false;

        // Regex to match table row: | Day | Name | Dur | Desc |
        // Adjust regex based on strict format from prompt:
        // | Day | Activity Name | Duration | Description with Goal |
        const rowRegex = /^\|\s*(.+?)\s*\|\s*(.+?)\s*\|\s*(.+?)\s*\|\s*(.+?)\s*\|/;

        for (const line of lines) {
            if (line.includes('| Day |')) {
                inTable = true;
                continue;
            }
            if (line.includes('|-')) continue; // Separator

            if (inTable) {
                const match = line.match(rowRegex);
                if (match) {
                    const [_, day, name, duration, description] = match;
                    // Simple heuristic: Is it a bike workout?
                    if (
                        name.toLowerCase().includes('ride') ||
                        name.toLowerCase().includes('bike') ||
                        name.toLowerCase().includes('cycling') ||
                        name.toLowerCase().includes('intervals') ||
                        name.toLowerCase().includes('ftp') ||
                        name.toLowerCase().includes('vo2') ||
                        name.toLowerCase().includes('power')
                    ) {
                        workouts.push({
                            day: day.trim(),
                            name: name.trim(),
                            duration: duration.trim(),
                            description: description.trim()
                        });
                    }
                }
            }
        }
        return workouts;
    };

    const workouts = parseWorkouts(planMarkdown);

    const handleExport = async (workout: ParsedWorkout) => {
        setGenerating(workout.name);
        setError(null);
        try {
            const response = await axios.post('/api/ai/zwo', {
                workoutName: workout.name,
                workoutDescription: workout.description,
                ftp: userSettings.ftp,
                maxHr: userSettings.maxHr
            });

            const { xmlContent, filename } = response.data;

            // Trigger download
            const blob = new Blob([xmlContent], { type: 'application/xml' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

        } catch (err) {
            console.error('Export failed', err);
            setError('Failed to generate Zwift file. Please try again.');
        } finally {
            setGenerating(null);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[80vh] flex flex-col animate-in fade-in zoom-in duration-200">

                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-t-3xl">
                    <div className="flex items-center gap-3">
                        <div className="bg-white/20 p-2 rounded-xl">
                            <Bike className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">Export to Zwift</h2>
                            <p className="text-orange-100 text-sm">Convert your AI workouts to .zwo files</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="hover:bg-white/20 p-2 rounded-full transition">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto flex-1 bg-gray-50">
                    {error && (
                        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-xl flex items-center gap-2 text-sm font-medium">
                            <AlertCircle className="w-4 h-4" />
                            {error}
                        </div>
                    )}

                    {!planMarkdown ? (
                        <div className="text-center py-12 text-gray-400">
                            <p>No plan generated yet.</p>
                        </div>
                    ) : workouts.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            <p className="mb-2">No bike workouts found in the provided plan.</p>
                            <p className="text-sm">Try generating a Cycling specific plan.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {workouts.map((workout, idx) => (
                                <div key={idx} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all flex items-center justify-between group">
                                    <div className="flex-1 min-w-0 pr-4">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{workout.day}</span>
                                            <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-medium">{workout.duration}</span>
                                        </div>
                                        <h3 className="font-bold text-gray-900 truncate">{workout.name}</h3>
                                        <p className="text-sm text-gray-500 line-clamp-1">{workout.description}</p>
                                    </div>

                                    <button
                                        onClick={() => handleExport(workout)}
                                        disabled={generating !== null}
                                        className={`
                                            flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all
                                            ${generating === workout.name
                                                ? 'bg-gray-100 text-gray-400 cursor-wait'
                                                : 'bg-orange-500 text-white hover:bg-orange-600 shadow-orange-500/20 shadow-lg hover:-translate-y-0.5'}
                                        `}
                                    >
                                        {generating === workout.name ? (
                                            <>Converting...</>
                                        ) : (
                                            <>
                                                <Download className="w-4 h-4" /> Export
                                            </>
                                        )}
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 bg-gray-50 border-t border-gray-100 text-center text-xs text-gray-400 rounded-b-3xl">
                    Import these .zwo files into Documents/Zwift/Workouts matches on PC/Mac.
                </div>
            </div>
        </div>
    );
}
