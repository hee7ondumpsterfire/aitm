'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

interface ZoneSettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (maxHr: number, ftp: number) => void;
}

export default function ZoneSettingsModal({ isOpen, onClose, onSave }: ZoneSettingsModalProps) {
    const [maxHr, setMaxHr] = useState<string>('190');
    const [ftp, setFtp] = useState<string>('250');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(Number(maxHr), Number(ftp));
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full relative overflow-hidden">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                >
                    <X className="w-6 h-6" />
                </button>

                <div className="p-8">
                    <h2 className="text-2xl font-bold mb-2 text-gray-900">Configure Zones</h2>
                    <p className="text-gray-600 mb-6">
                        Enter your metrics to calculate training zones manually.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Max Heart Rate (bpm)
                            </label>
                            <input
                                type="number"
                                value={maxHr}
                                onChange={(e) => setMaxHr(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
                                placeholder="e.g. 190"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Functional Threshold Power (FTP) (watts)
                            </label>
                            <input
                                type="number"
                                value={ftp}
                                onChange={(e) => setFtp(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
                                placeholder="e.g. 250"
                                required
                            />
                        </div>

                        <div className="flex gap-4 pt-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 py-3 px-6 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-full transition duration-300"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="flex-1 py-3 px-6 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-full transition duration-300"
                            >
                                Calculate & Save
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
