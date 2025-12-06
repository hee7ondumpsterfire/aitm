import React, { useState, useEffect } from 'react';
import { X, User, Activity, Zap, Scale, Ruler } from 'lucide-react';

interface UserProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    stravaProfile: any; // Data from Strava API
    currentSettings: {
        maxHr: number;
        ftp: number;
        weight: number;
        height: number;
        colorBlindMode?: boolean;
    };
    onSave: (settings: { maxHr: number; ftp: number; weight: number; height: number; colorBlindMode?: boolean }) => void;
}

export default function UserProfileModal({ isOpen, onClose, stravaProfile, currentSettings, onSave }: UserProfileModalProps) {
    // Use strings for local state to handle empty inputs better
    const [maxHr, setMaxHr] = useState(currentSettings.maxHr.toString());
    const [ftp, setFtp] = useState(currentSettings.ftp.toString());
    const [weight, setWeight] = useState(currentSettings.weight.toString());
    const [height, setHeight] = useState(currentSettings.height.toString());

    useEffect(() => {
        if (isOpen) {
            setMaxHr(currentSettings.maxHr.toString());
            setFtp(currentSettings.ftp.toString());
            setWeight(currentSettings.weight.toString());
            setHeight(currentSettings.height.toString());
        }
    }, [isOpen]); // Only run when opening to prevent resets while typing

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            maxHr: Number(maxHr) || 0,
            ftp: Number(ftp) || 0,
            weight: Number(weight) || 0,
            height: Number(height) || 0
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white w-full max-w-md shadow-2xl overflow-hidden relative">
                {/* Header */}
                <div className="bg-indigo-600 p-6 text-white flex justify-between items-center">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <User className="w-6 h-6" />
                        User Profile
                    </h2>
                    <button onClick={onClose} className="text-white/80 hover:text-white transition">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {stravaProfile && (
                        <div className="mb-6 flex items-center gap-4 p-4 bg-indigo-50 rounded-lg border border-indigo-100">
                            {stravaProfile.profile && (
                                <img
                                    src={stravaProfile.profile}
                                    alt="Profile"
                                    className="w-16 h-16 rounded-full border-2 border-indigo-200"
                                />
                            )}
                            <div>
                                <p className="text-sm text-indigo-600 font-semibold uppercase tracking-wider">Connected as</p>
                                <p className="text-xl font-bold text-gray-900">
                                    {stravaProfile.firstname} {stravaProfile.lastname}
                                </p>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                                    <Scale className="w-4 h-4 text-gray-400" /> Weight (kg)
                                </label>
                                <input
                                    type="number"
                                    value={weight}
                                    onChange={(e) => setWeight(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition text-gray-900"
                                    placeholder="75"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                                    <Ruler className="w-4 h-4 text-gray-400" /> Height (cm)
                                </label>
                                <input
                                    type="number"
                                    value={height}
                                    onChange={(e) => setHeight(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition text-gray-900"
                                    placeholder="180"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                                <Activity className="w-4 h-4 text-red-500" /> Max Heart Rate (bpm)
                            </label>
                            <input
                                type="number"
                                value={maxHr}
                                onChange={(e) => setMaxHr(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition text-gray-900"
                                placeholder="190"
                            />
                            <p className="text-xs text-gray-500 mt-1">Used to calculate heart rate zones.</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                                <Zap className="w-4 h-4 text-yellow-500" /> Functional Threshold Power (FTP)
                            </label>
                            <input
                                type="number"
                                value={ftp}
                                onChange={(e) => setFtp(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition text-gray-900"
                                placeholder="250"
                            />
                            <p className="text-xs text-gray-500 mt-1">Used to calculate power zones.</p>
                        </div>

                        <div className="pt-4 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded transition"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded shadow-md hover:shadow-lg transition transform hover:-translate-y-0.5"
                            >
                                Save Profile
                            </button>
                        </div>
                    </form>

                    <div className="mt-6 border-t pt-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Zap className="w-4 h-4 text-gray-500" />
                                <span className="text-sm font-medium text-gray-700">Color Blind Mode</span>
                            </div>
                            <button
                                type="button"
                                onClick={() => onSave({ ...currentSettings, colorBlindMode: !currentSettings.colorBlindMode })}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${currentSettings.colorBlindMode ? 'bg-indigo-600' : 'bg-gray-200'}`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${currentSettings.colorBlindMode ? 'translate-x-6' : 'translate-x-1'}`}
                                />
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">High contrast colors for better accessibility.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
