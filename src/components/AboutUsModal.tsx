'use client';

import { X, Shield, FileText, Globe, Scale } from 'lucide-react';

interface AboutUsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AboutUsModal({ isOpen, onClose }: AboutUsModalProps) {
    if (!isOpen) return null;

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
                <div className="bg-gradient-to-r from-purple-800 to-indigo-900 p-8 text-white">
                    <h2 className="text-3xl font-bold mb-2">About Coachweek</h2>
                    <p className="text-purple-200">Our vision for the future of AI-driven training.</p>
                </div>

                <div className="p-8 space-y-8">
                    {/* Vision Section */}
                    <div className="bg-purple-50 p-6 rounded-xl border border-purple-100">
                        <h3 className="text-lg font-bold text-purple-900 mb-4 flex items-center gap-2">
                            <Globe className="w-5 h-5" /> Our Vision
                        </h3>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            Coachweek is designed to democratize high-quality training plans. We believe that every athlete, regardless of budget, deserves a personalized coaching experience.
                        </p>
                        <p className="text-gray-700 leading-relaxed">
                            Currently in active development, Coachweek aims to become a fully AI-driven training management platform that adapts in real-time to your physiology, schedule, and goals.
                        </p>
                    </div>

                    {/* Compliance Section */}
                    <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                        <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2">
                            <Scale className="w-5 h-5" /> Compliance & Standards
                        </h3>
                        <p className="text-sm text-gray-700 mb-4">
                            We are committed to meeting the highest standards of data privacy and AI ethics.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <a
                                href="https://gdpr.eu/what-is-gdpr/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 p-3 bg-white rounded border border-blue-200 hover:border-blue-400 transition"
                            >
                                <Shield className="w-4 h-4 text-blue-600" />
                                <span className="text-sm font-medium text-blue-800">DSGVO / GDPR</span>
                            </a>
                            <a
                                href="https://artificialintelligenceact.eu/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 p-3 bg-white rounded border border-blue-200 hover:border-blue-400 transition"
                            >
                                <FileText className="w-4 h-4 text-blue-600" />
                                <span className="text-sm font-medium text-blue-800">EU AI Act</span>
                            </a>
                        </div>
                    </div>

                    {/* Impressum / Legal (Moved from FAQ) */}
                    <div className="border-t border-gray-200 pt-8 text-center">
                        <h4 className="text-sm font-bold text-gray-900 mb-6 uppercase tracking-wider">Impressum & Legal</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left max-w-2xl mx-auto">
                            <div>
                                <h5 className="text-xs font-bold text-gray-500 mb-2 flex items-center gap-1">
                                    <Shield className="w-3 h-3" /> Data Privacy
                                </h5>
                                <p className="text-xs text-gray-500 leading-relaxed">
                                    We take your privacy seriously. Your Strava data is only used to generate your training plan and is not shared with third parties. We do not store your activity data permanently.
                                </p>
                            </div>
                            <div>
                                <h5 className="text-xs font-bold text-gray-500 mb-2 flex items-center gap-1">
                                    <FileText className="w-3 h-3" /> Terms of Service
                                </h5>
                                <p className="text-xs text-gray-500 leading-relaxed">
                                    By using this application, you agree to our terms. This app is provided "as is" without warranty of any kind. Use at your own risk.
                                </p>
                            </div>
                        </div>
                        <p className="text-[10px] text-gray-400 mt-8">
                            © {new Date().getFullYear()} Coachweek. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
