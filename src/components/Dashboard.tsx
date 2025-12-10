'use client';

import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Activity as ActivityIcon, Calendar, Clock, MapPin, Bike, Waves, Footprints, Mountain } from 'lucide-react';
import Questionnaire, { QuestionnaireData } from './Questionnaire';
import WorkoutCard from './WorkoutCard';
import ActivityPieChart from './ActivityPieChart';
import HRZoneChart from './HRZoneChart';
import PowerZoneChart from './PowerZoneChart';
import WeeklyTSSChart from './WeeklyTSSChart';
import WKgChart from './WKgChart';
import IntroductionModal from './IntroductionModal';
import UserProfileModal from './UserProfileModal';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import ActivityDetailsModal from './ActivityDetailsModal';
import FeelingSurveyModal from './FeelingSurveyModal';
import AboutUsModal from './AboutUsModal';
import SocialMediaModal from './SocialMediaModal';
import Header from './Header';
import Footer from './Footer';
import ChatWidget from './ChatWidget';
import { startOfWeek, endOfWeek, subWeeks, isWithinInterval, parseISO } from 'date-fns';

interface Activity {
    id: number;
    name: string;
    type: string;
    start_date: string;
    distance: number;
    moving_time: number;
    total_elevation_gain: number;
    average_heartrate?: number;
    average_watts?: number;
    weighted_average_watts?: number;
}

import { useTheme } from '@/context/ThemeContext';

import ZwiftExportModal from './ZwiftExportModal';

export default function Dashboard({ isGuest = false }: { isGuest?: boolean }) {
    // ... activities state ...
    const [activities, setActivities] = useState<Activity[]>([]);
    const [zones, setZones] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [plan, setPlan] = useState<any>(null);
    const [generatingPlan, setGeneratingPlan] = useState(false);
    const [showQuestionnaire, setShowQuestionnaire] = useState(false);
    const [showIntro, setShowIntro] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [showFeelingSurvey, setShowFeelingSurvey] = useState(false);
    const [showAboutUs, setShowAboutUs] = useState(false);
    const [showSocialMedia, setShowSocialMedia] = useState(false);

    const [stravaProfile, setStravaProfile] = useState<any>(null);
    const [userSettings, setUserSettings] = useState({
        maxHr: 190,
        ftp: 250,
        weight: 75,
        height: 180,
        colorBlindMode: false
    });
    const [planType, setPlanType] = useState<'standard' | 'polarized'>('standard');
    const { darkMode, setDarkMode } = useTheme();


    const [authError, setAuthError] = useState(false);
    const [profileImageError, setProfileImageError] = useState(false);
    const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (isGuest) {
                setLoading(false);
                setShowQuestionnaire(true);
                return;
            }

            try {
                // Fetch activities first as they are critical
                const activitiesResponse = await axios.get('/api/strava/activities', { timeout: 15000 });
                const fetchedActivities = activitiesResponse.data;
                setActivities(fetchedActivities);

                if (fetchedActivities.length === 0) {
                    setShowQuestionnaire(true);
                }

                // Try to fetch zones, but don't fail if it errors (e.g. missing scope)
                try {
                    const zonesResponse = await axios.get('/api/strava/zones');
                    setZones(zonesResponse.data);
                } catch (zoneError) {
                    console.warn('Failed to fetch zones, using defaults. User might need to re-login for permissions.', zoneError);
                }

                // Fetch Strava Profile
                try {
                    const profileResponse = await axios.get('/api/strava/profile');
                    setStravaProfile(profileResponse.data);
                    // Update weight if available from Strava
                    if (profileResponse.data.weight) {
                        setUserSettings(prev => ({ ...prev, weight: profileResponse.data.weight }));
                    }
                } catch (profileError) {
                    console.warn('Failed to fetch profile', profileError);
                }

                // Fetch User Settings (Persistence)
                try {
                    const settingsResponse = await axios.get('/api/user/settings');
                    const savedSettings = settingsResponse.data;

                    if (savedSettings && Object.keys(savedSettings).length > 0) {
                        setUserSettings(prev => ({
                            ...prev,
                            ...savedSettings
                        }));

                        // Recalculate zones immediately with saved settings
                        // Calculate HR Zones (Based on Max HR)
                        const hrZones = [
                            { min: 0, max: Math.round(savedSettings.maxHr * 0.6) },
                            { min: Math.round(savedSettings.maxHr * 0.6), max: Math.round(savedSettings.maxHr * 0.7) },
                            { min: Math.round(savedSettings.maxHr * 0.7), max: Math.round(savedSettings.maxHr * 0.8) },
                            { min: Math.round(savedSettings.maxHr * 0.8), max: Math.round(savedSettings.maxHr * 0.9) },
                            { min: Math.round(savedSettings.maxHr * 0.9), max: 250 },
                        ];

                        // Calculate Power Zones (Based on FTP)
                        const powerZones = [
                            { min: 0, max: Math.round(savedSettings.ftp * 0.55) },
                            { min: Math.round(savedSettings.ftp * 0.55), max: Math.round(savedSettings.ftp * 0.75) },
                            { min: Math.round(savedSettings.ftp * 0.75), max: Math.round(savedSettings.ftp * 0.90) },
                            { min: Math.round(savedSettings.ftp * 0.90), max: Math.round(savedSettings.ftp * 1.05) },
                            { min: Math.round(savedSettings.ftp * 1.05), max: 2000 },
                        ];

                        setZones({
                            heart_rate: { zones: hrZones },
                            power: { zones: powerZones }
                        });
                    }
                } catch (settingsError) {
                    console.warn('Failed to fetch user settings', settingsError);
                }

            } catch (error: any) {
                console.error('Failed to fetch activities', error);
                if (error.response && error.response.status === 401) {
                    setAuthError(true);
                } else {
                    // Fallback to questionnaire on error or empty
                    setShowQuestionnaire(true);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const calculateAverageTSS = () => {
        // Calculate average TSS for the last 8 completed weeks (excluding current)
        const weeks = [];
        const today = new Date();

        // Get last 8 weeks (1 to 8 weeks ago)
        for (let i = 1; i <= 8; i++) {
            const date = subWeeks(today, i);
            const start = startOfWeek(date, { weekStartsOn: 1 });
            const end = endOfWeek(date, { weekStartsOn: 1 });
            weeks.push({ start, end });
        }

        const weeklyScores = weeks.map(week => {
            return activities.reduce((total, activity) => {
                const activityDate = parseISO(activity.start_date);
                if (isWithinInterval(activityDate, { start: week.start, end: week.end })) {
                    // Calculate TSS (Simplified: Power based or HR based)
                    let score = 0;
                    const durationSeconds = activity.moving_time;

                    // Prefer Power
                    const power = activity.weighted_average_watts || activity.average_watts;
                    if (power && userSettings.ftp > 0) {
                        const intensityFactor = power / userSettings.ftp;
                        score = (durationSeconds * power * intensityFactor) / (userSettings.ftp * 3600) * 100;
                    }
                    // Fallback to HR
                    else if (activity.average_heartrate && userSettings.maxHr > 0) {
                        const estimatedLTR = userSettings.maxHr * 0.9;
                        const intensityFactor = activity.average_heartrate / estimatedLTR;
                        score = (durationSeconds / 3600) * (intensityFactor * intensityFactor) * 100;
                    }
                    return total + score;
                }
                return total;
            }, 0);
        });

        const totalTSS = weeklyScores.reduce((a, b) => a + b, 0);
        return Math.round(totalTSS / 8);
    };

    const handleFeelingConfirm = (feeling: 'sad' | 'normal' | 'happy') => {
        const avgTSS = calculateAverageTSS();
        let multiplier = 1.0;

        if (feeling === 'sad') multiplier = 0.6;
        if (feeling === 'happy') multiplier = 1.1;

        const targetTSS = Math.round(avgTSS * multiplier);
        console.log(`Average TSS: ${avgTSS}, Feeling: ${feeling}, Target TSS: ${targetTSS}`);

        generatePlan(planType, undefined, targetTSS, feeling);
    };

    const generatePlan = async (type: string = 'standard', questionnaireData?: QuestionnaireData, targetTSS?: number, feeling?: string) => {
        setGeneratingPlan(true);
        try {
            const payload: any = { type };
            if (questionnaireData) {
                payload.questionnaire = questionnaireData;
            } else {
                payload.activities = activities;
            }

            if (targetTSS) payload.targetTSS = targetTSS;
            if (feeling) payload.feeling = feeling;

            const response = await axios.post('/api/ai/coach', payload);

            let planData = response.data.plan;
            if (typeof planData === 'string') {
                try {
                    planData = JSON.parse(planData);
                } catch (e) {
                    console.error("Failed to parse plan JSON", e);
                    // Fallback if AI returned plain text/markdown by mistake
                    planData = { weekly_summary: "Generated Plan", workouts: [] };
                }
            }
            setPlan(planData);
        } catch (error) {
            console.error('Failed to generate plan', error);
        } finally {
            setGeneratingPlan(false);
        }
    };

    const handleQuestionnaireSubmit = (data: QuestionnaireData) => {
        generatePlan('polarized', data);
    };

    const handleProfileSave = async (settings: { maxHr: number; ftp: number; weight: number; height: number; colorBlindMode?: boolean }) => {
        setUserSettings(prev => ({ ...settings, colorBlindMode: settings.colorBlindMode ?? prev.colorBlindMode ?? false }));

        // Persist settings
        try {
            await axios.post('/api/user/settings', settings);
        } catch (error) {
            console.error('Failed to save settings', error);
        }

        // Calculate HR Zones (Based on Max HR)
        const hrZones = [
            { min: 0, max: Math.round(settings.maxHr * 0.6) },      // Z1: < 60%
            { min: Math.round(settings.maxHr * 0.6), max: Math.round(settings.maxHr * 0.7) }, // Z2: 60-70%
            { min: Math.round(settings.maxHr * 0.7), max: Math.round(settings.maxHr * 0.8) }, // Z3: 70-80%
            { min: Math.round(settings.maxHr * 0.8), max: Math.round(settings.maxHr * 0.9) }, // Z4: 80-90%
            { min: Math.round(settings.maxHr * 0.9), max: 250 },    // Z5: > 90%
        ];

        // Calculate Power Zones (Based on FTP)
        const powerZones = [
            { min: 0, max: Math.round(settings.ftp * 0.55) },       // Z1: < 55%
            { min: Math.round(settings.ftp * 0.55), max: Math.round(settings.ftp * 0.75) }, // Z2: 55-75%
            { min: Math.round(settings.ftp * 0.75), max: Math.round(settings.ftp * 0.90) }, // Z3: 75-90%
            { min: Math.round(settings.ftp * 0.90), max: Math.round(settings.ftp * 1.05) }, // Z4: 90-105%
            { min: Math.round(settings.ftp * 1.05), max: 2000 },    // Z5: > 105%
        ];

        setZones({
            heart_rate: { zones: hrZones },
            power: { zones: powerZones }
        });
    };

    const refreshActivities = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/strava/activities?refresh=true');
            setActivities(response.data);
        } catch (error) {
            console.error('Failed to refresh activities', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="p-8 text-center">Loading activities...</div>;
    }

    if (authError) {
        // ... (existing auth error code)
    }

    return (
        <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-black text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
            <div className="p-8 max-w-[95%] mx-auto">
                <div className="p-8 max-w-[95%] mx-auto">
                    <Header
                        darkMode={darkMode}
                        setDarkMode={setDarkMode}
                        isGuest={isGuest}
                        stravaProfile={stravaProfile}
                        onShowProfile={() => setShowProfileModal(true)}
                        onShowIntro={() => setShowIntro(true)}
                        onShowQuestionnaire={() => setShowQuestionnaire(true)}
                    >
                        {activities.length > 0 && (
                            <div className="flex items-center gap-4">
                                {/* Plan Type Switch */}
                                <div className="bg-gray-200 p-1 rounded-full flex">
                                    <button
                                        onClick={() => setPlanType('standard')}
                                        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${planType === 'standard'
                                            ? 'bg-violet-500 text-white shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        Pyramidal
                                    </button>
                                    <button
                                        onClick={() => setPlanType('polarized')}
                                        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${planType === 'polarized'
                                            ? 'bg-fuchsia-500 text-white shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        Polarized
                                    </button>
                                </div>

                                <button
                                    onClick={() => setShowFeelingSurvey(true)}
                                    disabled={generatingPlan || (activities.length === 0 && !plan)}
                                    className={`text-white font-bold py-2 px-6 rounded-full transition duration-300 disabled:opacity-50 ${planType === 'standard'
                                        ? 'bg-violet-500 hover:bg-violet-600'
                                        : 'bg-fuchsia-500 hover:bg-fuchsia-600'
                                        }`}
                                >
                                    {generatingPlan ? 'Analyzing...' : 'Generate Plan'}
                                </button>

                                {plan && (
                                    <button
                                        onClick={() => setShowZwiftModal(true)}
                                        className="bg-orange-500 hover:bg-orange-600 text-white font-bold p-2 rounded-full transition duration-300 shadow-sm"
                                        title="Export Workouts to Zwift"
                                    >
                                        <Bike className="w-5 h-5" />
                                    </button>
                                )}
                            </div>
                        )}
                    </Header>


                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-[350px_1fr_350px] gap-8 items-stretch">
                        {/* Column 1: Charts */}
                        <div className="flex flex-col gap-2">
                            {activities.length > 0 && (
                                <>
                                    <WeeklyTSSChart activities={activities} ftp={userSettings.ftp} maxHr={userSettings.maxHr} colorBlindMode={userSettings.colorBlindMode} />
                                    <HRZoneChart activities={activities} zones={zones?.heart_rate} model={planType} colorBlindMode={userSettings.colorBlindMode} />
                                    <PowerZoneChart activities={activities} zones={zones?.power} model={planType} colorBlindMode={userSettings.colorBlindMode} />
                                    <WKgChart ftp={userSettings.ftp} weight={userSettings.weight} activities={activities} colorBlindMode={userSettings.colorBlindMode} />
                                </>
                            )}
                        </div>

                        {/* Column 2: Coach Plan */}
                        <div
                            className={`${darkMode ? 'bg-[#99A1AF]' : 'bg-gray-200'} p-6 shadow-lg border border-purple-500/30 rounded-none flex flex-col relative overflow-hidden h-full`}
                            style={{
                                backgroundImage: `url('/cyclist_watermark.png')`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                backgroundBlendMode: 'overlay',
                            }}
                        >
                            <div className="absolute inset-0 bg-white/60 pointer-events-none"></div>
                            <div className="relative z-10 flex flex-col h-full">
                                <h2 className="text-xl font-semibold mb-2 text-purple-700">Coach's Plan</h2>
                                {plan ? (
                                    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                                        {plan.weekly_summary && (
                                            <div className="mb-4 bg-white/80 p-3 rounded-xl text-sm italic border-l-4 border-purple-500 shadow-sm">
                                                "{plan.weekly_summary}"
                                            </div>
                                        )}

                                        <div className="space-y-4 pb-4">
                                            {plan.workouts?.map((workout: any, idx: number) => (
                                                <WorkoutCard
                                                    key={idx}
                                                    workout={workout}
                                                    userSettings={{ ftp: userSettings.ftp, maxHr: userSettings.maxHr }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full text-gray-500 italic text-center p-4">
                                        <div className="bg-white/50 p-4 rounded-full mb-4">
                                            <Bike className="w-8 h-8 text-gray-400" />
                                        </div>
                                        <p className="font-medium text-gray-700">Ready to train?</p>
                                        <p className="text-sm mt-2 max-w-[200px]">Click "Generate Plan" and I'll build a custom week based on your data.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Column 3: Recent Activities List */}
                        <div className="flex flex-col h-full">
                            <div className="bg-gray-400 p-6 shadow-lg rounded-none flex flex-col h-[600px]">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-semibold text-gray-800">Recent Activities (3 months)</h2>
                                    <button
                                        onClick={refreshActivities}
                                        className="text-xs bg-gray-300 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-none transition"
                                        title="Force sync with Strava"
                                    >
                                        Refresh
                                    </button>
                                </div>
                                <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                                    {activities.length === 0 ? (
                                        <p className="text-gray-600">No activities found. Plan generated based on questionnaire.</p>
                                    ) : (
                                        activities
                                            .sort((a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime())
                                            .map((activity) => (
                                                <div
                                                    key={activity.id}
                                                    onClick={() => setSelectedActivity(activity)}
                                                    className="bg-gray-300 p-4 hover:bg-gray-200 transition rounded-none cursor-pointer"
                                                >
                                                    <div className="flex justify-between items-start mb-2">
                                                        <h3 className="font-bold text-gray-900">{activity.name}</h3>
                                                        <span className="text-xs bg-purple-500/20 text-purple-700 px-2 py-1 rounded-none flex items-center gap-1">
                                                            {activity.type === 'Ride' || activity.type === 'VirtualRide' ? <Bike className="w-3 h-3" /> :
                                                                activity.type === 'Run' || activity.type === 'VirtualRun' ? <Footprints className="w-3 h-3" /> :
                                                                    activity.type === 'Swim' ? <Waves className="w-3 h-3" /> :
                                                                        activity.type === 'Hike' || activity.type === 'Walk' ? <Mountain className="w-3 h-3" /> :
                                                                            <ActivityIcon className="w-3 h-3" />}
                                                            {activity.type}
                                                        </span>
                                                    </div>
                                                    <div className="flex gap-4 text-sm text-gray-700">
                                                        <div className="flex items-center gap-1">
                                                            <Calendar className="w-4 h-4" />
                                                            {new Date(activity.start_date).toLocaleDateString()}
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <MapPin className="w-4 h-4" />
                                                            {(activity.distance / 1000).toFixed(2)} km
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <Clock className="w-4 h-4" />
                                                            {Math.floor(activity.moving_time / 60)} min
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                    )}
                                </div>
                            </div>
                            {
                                activities.length > 0 && (
                                    <div className="mt-8">
                                        <ActivityPieChart activities={activities} colorBlindMode={userSettings.colorBlindMode} />
                                    </div>
                                )
                            }
                        </div >
                    </div >
                    <IntroductionModal isOpen={showIntro} onClose={() => setShowIntro(false)} />
                    <Questionnaire
                        isOpen={showQuestionnaire}
                        onClose={() => setShowQuestionnaire(false)}
                        onSubmit={handleQuestionnaireSubmit}
                    />
                    <UserProfileModal
                        isOpen={showProfileModal}
                        onClose={() => setShowProfileModal(false)}
                        stravaProfile={stravaProfile}
                        currentSettings={userSettings}
                        onSave={handleProfileSave}
                    />
                    <FeelingSurveyModal
                        isOpen={showFeelingSurvey}
                        onClose={() => setShowFeelingSurvey(false)}
                        onConfirm={handleFeelingConfirm}
                    />
                    <ActivityDetailsModal
                        activity={selectedActivity}
                        onClose={() => setSelectedActivity(null)}
                    />
                    <AboutUsModal
                        isOpen={showAboutUs}
                        onClose={() => setShowAboutUs(false)}
                    />
                    <SocialMediaModal
                        isOpen={showSocialMedia}
                        onClose={() => setShowSocialMedia(false)}
                    />

                </div>
                <Footer onAboutClick={() => setShowAboutUs(true)} onFollowClick={() => setShowSocialMedia(true)} darkMode={darkMode} />
                <ChatWidget
                    contextData={{
                        activities: activities,
                        zones: zones,
                        userSettings: userSettings,
                        plan: plan
                    }}
                />
            </div>
        </div>
    );
}
