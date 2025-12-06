'use client';

import { X, ChevronDown, ChevronUp, Mail, Coffee } from 'lucide-react';
import { useState } from 'react';

interface IntroductionModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function IntroductionModal({ isOpen, onClose }: IntroductionModalProps) {
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    if (!isOpen) return null;

    const faqs = [
        {
            question: "How does Coachweek work?",
            answer: "Coachweek analyzes your recent Strava activities (Power, Heart Rate, Duration) to understand your current fitness level. It then uses AI to generate a personalized weekly training plan tailored to your goals."
        },
        {
            question: "What is the difference between Pyramidal and Polarized?",
            answer: "Pyramidal training focuses on a mix of low, moderate, and high intensity (plenty of Zone 2, some Zone 3/4). Polarized training is more extreme: mostly easy (Zone 1/2) and some very hard (Zone 5), avoiding the 'middle' zones."
        },
        {
            question: "Do I need a power meter?",
            answer: "For the most accurate results, yes. However, we can also estimate training stress based on Heart Rate (hrTSS) if you don't have power data."
        },
        {
            question: "Do you have ideas for future features in Coachweek?",
            answer: (
                <span>
                    Send a mail to{' '}
                    <a href="mailto:maxtinowittig+coachweek@gmail.com" className="text-purple-600 hover:underline">
                        maxtinowittig+coachweek@gmail.com
                    </a>{' '}
                    and submit your ideas today. Thank you
                </span>
            )
        }
    ];

    const toggleFaq = (index: number) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white w-full max-w-2xl shadow-2xl overflow-hidden relative rounded-lg max-h-[90vh] overflow-y-auto">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10"
                >
                    <X className="w-6 h-6" />
                </button>

                {/* Header */}
                <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-8 text-white">
                    <h2 className="text-3xl font-bold mb-2">Frequently Asked Questions</h2>
                    <p className="text-gray-300">Everything you need to know about Coachweek.</p>
                </div>

                <div className="p-8 space-y-8">
                    {/* FAQ Section */}
                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                                <button
                                    onClick={() => toggleFaq(index)}
                                    className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 transition text-left"
                                >
                                    <span className="font-semibold text-gray-800">{faq.question}</span>
                                    {openFaq === index ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                                </button>
                                {openFaq === index && (
                                    <div className="p-4 bg-white text-gray-600 text-sm leading-relaxed border-t border-gray-200">
                                        {faq.answer}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Newsletter & Donation Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Newsletter */}
                        <div className="bg-purple-50 p-6 rounded-xl border border-purple-100">
                            <h3 className="font-bold text-purple-900 flex items-center gap-2 mb-2">
                                <Mail className="w-5 h-5" /> Newsletter
                            </h3>
                            <p className="text-sm text-purple-700 mb-4">Get the latest training tips and feature updates.</p>
                            <div className="flex gap-2">
                                <input
                                    type="email"
                                    placeholder="your@email.com"
                                    className="flex-1 p-2 text-sm border border-purple-200 rounded focus:ring-2 focus:ring-purple-500 outline-none"
                                />
                                <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded text-sm font-bold transition">
                                    Join
                                </button>
                            </div>
                        </div>

                        {/* Donation */}
                        <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-100 flex flex-col justify-between">
                            <div>
                                <h3 className="font-bold text-yellow-900 flex items-center gap-2 mb-2">
                                    <Coffee className="w-5 h-5" /> Support Us
                                </h3>
                                <p className="text-sm text-yellow-800 mb-4">If you like the app, consider buying us a coffee!</p>
                            </div>
                            <a
                                href="https://www.buymeacoffee.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-[#FFDD00] hover:bg-[#FFDD00]/90 text-black px-4 py-2 rounded text-sm font-bold transition flex items-center justify-center gap-2 shadow-sm"
                            >
                                <Coffee className="w-4 h-4" />
                                Buy me a coffee
                            </a>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
