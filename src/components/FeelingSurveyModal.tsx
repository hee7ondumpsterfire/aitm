import React, { useState } from 'react';
import { Frown, Meh, Smile, Info } from 'lucide-react';

interface FeelingSurveyModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (feeling: 'sad' | 'normal' | 'happy') => void;
}

export default function FeelingSurveyModal({ isOpen, onClose, onConfirm }: FeelingSurveyModalProps) {
    const [selectedFeeling, setSelectedFeeling] = useState<'sad' | 'normal' | 'happy' | null>(null);

    if (!isOpen) return null;

    const handleConfirm = () => {
        if (selectedFeeling) {
            onConfirm(selectedFeeling);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-none shadow-xl w-full max-w-md p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                >
                    ✕
                </button>

                <h2 className="text-2xl font-bold text-gray-800 mb-2">How are you feeling?</h2>
                <p className="text-gray-600 mb-6">Your selection will adjust the training intensity for the upcoming week.</p>

                <div className="flex justify-between gap-4 mb-8">
                    <button
                        onClick={() => setSelectedFeeling('sad')}
                        className={`flex-1 flex flex-col items-center gap-2 p-4 border-2 transition-all duration-200 ${selectedFeeling === 'sad' ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-red-200'}`}
                    >
                        <Frown className={`w-12 h-12 ${selectedFeeling === 'sad' ? 'text-red-500' : 'text-gray-400'}`} />
                        <span className={`font-medium ${selectedFeeling === 'sad' ? 'text-red-700' : 'text-gray-500'}`}>Tired / Stressed</span>
                    </button>

                    <button
                        onClick={() => setSelectedFeeling('normal')}
                        className={`flex-1 flex flex-col items-center gap-2 p-4 border-2 transition-all duration-200 ${selectedFeeling === 'normal' ? 'border-yellow-500 bg-yellow-50' : 'border-gray-200 hover:border-yellow-200'}`}
                    >
                        <Meh className={`w-12 h-12 ${selectedFeeling === 'normal' ? 'text-yellow-500' : 'text-gray-400'}`} />
                        <span className={`font-medium ${selectedFeeling === 'normal' ? 'text-yellow-700' : 'text-gray-500'}`}>Normal</span>
                    </button>

                    <button
                        onClick={() => setSelectedFeeling('happy')}
                        className={`flex-1 flex flex-col items-center gap-2 p-4 border-2 transition-all duration-200 ${selectedFeeling === 'happy' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-200'}`}
                    >
                        <Smile className={`w-12 h-12 ${selectedFeeling === 'happy' ? 'text-green-500' : 'text-gray-400'}`} />
                        <span className={`font-medium ${selectedFeeling === 'happy' ? 'text-green-700' : 'text-gray-500'}`}>Great / Fresh</span>
                    </button>
                </div>

                {selectedFeeling && (
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 flex gap-3">
                        <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                        <div className="text-sm text-blue-800">
                            {selectedFeeling === 'sad' && (
                                <p><strong>Rest Week:</strong> We'll reduce volume to <strong>60%</strong> of your 8-week average TSS to help you recover.</p>
                            )}
                            {selectedFeeling === 'normal' && (
                                <p><strong>Maintenance:</strong> We'll target <strong>100%</strong> of your 8-week average TSS to maintain fitness.</p>
                            )}
                            {selectedFeeling === 'happy' && (
                                <p><strong>Build Week:</strong> We'll increase volume to <strong>110%</strong> of your 8-week average TSS to push your limits.</p>
                            )}
                        </div>
                    </div>
                )}

                <button
                    onClick={handleConfirm}
                    disabled={!selectedFeeling}
                    className={`w-full py-3 px-6 rounded-none font-bold text-white transition duration-300 ${selectedFeeling ? 'bg-purple-600 hover:bg-purple-700 shadow-lg' : 'bg-gray-300 cursor-not-allowed'}`}
                >
                    Generate Plan
                </button>
            </div>
        </div>
    );
}
