import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface QuestionnaireProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: QuestionnaireData) => void;
}

export interface QuestionnaireData {
    sports: string[];
    goals: string[];
    hours: string;
}

export default function Questionnaire({ isOpen, onClose, onSubmit }: QuestionnaireProps) {
    const [sports, setSports] = useState<string[]>([]);
    const [goals, setGoals] = useState<string[]>([]);
    const [hours, setHours] = useState<string>('0-3');

    if (!isOpen) return null;

    const handleSportChange = (sport: string) => {
        setSports(prev =>
            prev.includes(sport) ? prev.filter(s => s !== sport) : [...prev, sport]
        );
    };

    const handleGoalChange = (goal: string) => {
        setGoals(prev =>
            prev.includes(goal) ? prev.filter(g => g !== goal) : [...prev, goal]
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ sports, goals, hours });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white w-full max-w-2xl shadow-2xl overflow-hidden relative max-h-[90vh] overflow-y-auto">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10"
                >
                    <X className="w-6 h-6" />
                </button>

                <div className="bg-purple-600 p-6 text-white">
                    <h2 className="text-2xl font-bold">Tell us about your training</h2>
                    <p className="text-purple-100 mt-2">We couldn't find recent Strava activities. Please answer a few questions to help us create your plan.</p>
                </div>

                <div className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Sports */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-3">Which sports do you do?</h3>
                            <div className="grid grid-cols-2 gap-3">
                                {['Running', 'Cycling', 'Swimming', 'Hiking'].map(sport => (
                                    <label key={sport} className="flex items-center space-x-3 text-gray-800 cursor-pointer hover:bg-gray-100 p-2 transition rounded">
                                        <input
                                            type="checkbox"
                                            checked={sports.includes(sport)}
                                            onChange={() => handleSportChange(sport)}
                                            className="form-checkbox h-5 w-5 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                                        />
                                        <span>{sport}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Goals */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-3">What are your goals?</h3>
                            <div className="grid grid-cols-2 gap-3">
                                {['Get Fitter', 'Longevity', 'Racing', 'Improve Health'].map(goal => (
                                    <label key={goal} className="flex items-center space-x-3 text-gray-800 cursor-pointer hover:bg-gray-100 p-2 transition rounded">
                                        <input
                                            type="checkbox"
                                            checked={goals.includes(goal)}
                                            onChange={() => handleGoalChange(goal)}
                                            className="form-checkbox h-5 w-5 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                                        />
                                        <span>{goal}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Hours */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-3">Weekly training hours (last 3-6 months)</h3>
                            <select
                                value={hours}
                                onChange={(e) => setHours(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            >
                                <option value="0-3">0-3 hours</option>
                                <option value="4-6">4-6 hours</option>
                                <option value="7-9">7-9 hours</option>
                                <option value="10+">10+ hours</option>
                            </select>
                        </div>

                        <button
                            type="submit"
                            disabled={sports.length === 0 || goals.length === 0}
                            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-4 shadow-md"
                        >
                            Generate Plan
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
