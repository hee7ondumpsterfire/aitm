'use client';

import Link from 'next/link';
import { Activity as ActivityIcon, User, Sun, Moon } from 'lucide-react';
import { useState } from 'react';

interface HeaderProps {
    darkMode: boolean;
    setDarkMode: (value: boolean) => void;
    isGuest?: boolean;
    stravaProfile?: any;
    onShowProfile: () => void;
    onShowIntro: () => void;
    onShowQuestionnaire: () => void;
    children?: React.ReactNode;
}

export default function Header({
    darkMode,
    setDarkMode,
    isGuest = false,
    stravaProfile,
    onShowProfile,
    onShowIntro,
    onShowQuestionnaire,
    children
}: HeaderProps) {
    const [profileImageError, setProfileImageError] = useState(false);

    return (
        <header className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-[350px_1fr_350px] gap-8 items-center mb-8">
            {/* Column 1: Branding */}
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-4">
                    <Link href="/" className="text-3xl font-bold text-purple-600 flex items-center gap-2 hover:opacity-80 transition">
                        <ActivityIcon /> Coachweek
                    </Link>
                    <img src="/strava-compatible.png" alt="Compatible with Strava" className="h-8" />
                </div>
                <p className={`text-sm italic ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>improve your personal training week for free</p>
            </div>

            {/* Column 2: Center Controls (Plan Switch etc.) */}
            <div className="flex items-center justify-center">
                {children}
            </div>

            {/* Column 3: User Controls */}
            <div className="flex gap-4 items-center justify-end">
                {!isGuest && (
                    <button
                        onClick={onShowProfile}
                        className="bg-white hover:bg-gray-100 text-gray-700 rounded-full transition duration-300 mr-4 border border-gray-300 shadow-sm overflow-hidden w-10 h-10 min-w-[2.5rem] shrink-0 flex items-center justify-center"
                        title="User Profile"
                    >
                        {stravaProfile?.profile && !profileImageError ? (
                            <img
                                src={stravaProfile.profile}
                                alt="Profile"
                                className="w-full h-full object-cover"
                                onError={() => setProfileImageError(true)}
                            />
                        ) : (
                            <User className="w-5 h-5" />
                        )}
                    </button>
                )}

                <button
                    onClick={() => setDarkMode(!darkMode)}
                    className={`p-2 rounded-full transition duration-300 ${darkMode ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-300'}`}
                    title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                >
                    {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
                <button
                    onClick={onShowIntro}
                    className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-full transition duration-300 mr-4"
                >
                    FAQ
                </button>
                <button
                    onClick={onShowQuestionnaire}
                    className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-6 rounded-full transition duration-300 mr-4"
                >
                    Questionnaire
                </button>
            </div>
        </header>
    );
}
