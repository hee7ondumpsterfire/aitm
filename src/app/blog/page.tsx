'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AboutUsModal from '@/components/AboutUsModal';
import SocialMediaModal from '@/components/SocialMediaModal';
import IntroductionModal from '@/components/IntroductionModal';
import Questionnaire from '@/components/Questionnaire';
import { Calendar, User as UserIcon, Tag, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { blogPosts } from '@/data/blogPosts';
import Image from 'next/image';

export default function BlogPage() {
    const [darkMode, setDarkMode] = useState(false);
    const [showAboutUs, setShowAboutUs] = useState(false);
    const [showSocialMedia, setShowSocialMedia] = useState(false);
    const [showIntro, setShowIntro] = useState(false);
    const [showQuestionnaire, setShowQuestionnaire] = useState(false);

    return (
        <div className={`min-h-screen flex flex-col transition-colors duration-300 ${darkMode ? 'bg-black text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
            <div className="p-8 max-w-[95%] mx-auto w-full flex-grow">
                <Header
                    darkMode={darkMode}
                    setDarkMode={setDarkMode}
                    onShowIntro={() => setShowIntro(true)}
                    onShowQuestionnaire={() => setShowQuestionnaire(true)}
                    // Mock profile actions for guest/blog view
                    isGuest={true}
                    onShowProfile={() => { }}
                />

                <main className="max-w-6xl mx-auto py-12">
                    <div className="text-center mb-16">
                        <h1 className="text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
                            The Science of Speed
                        </h1>
                        <p className={`text-xl ${darkMode ? 'text-gray-400' : 'text-gray-600'} max-w-2xl mx-auto`}>
                            Deep dives into training methodology, AI, and recovery to help you become a faster cyclist.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {blogPosts.map(article => (
                            <Link href={`/blog/${article.slug}`} key={article.id} className="group">
                                <article className={`h-full flex flex-col rounded-2xl overflow-hidden shadow-lg transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl ${darkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-100'
                                    }`}>
                                    <div className="relative h-48 w-full overflow-hidden">
                                        <Image
                                            src={article.image}
                                            alt={article.title}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                        <div className="absolute top-4 right-4 bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                                            {article.category}
                                        </div>
                                    </div>

                                    <div className="p-6 flex-1 flex flex-col">
                                        <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                                            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {article.date}</span>
                                            <span className="flex items-center gap-1"><UserIcon className="w-3 h-3" /> {article.author}</span>
                                        </div>

                                        <h2 className={`text-xl font-bold mb-3 leading-tight group-hover:text-purple-600 transition-colors ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                            {article.title}
                                        </h2>

                                        <p className={`text-sm mb-4 leading-relaxed line-clamp-3 mb-auto ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                            {article.excerpt}
                                        </p>

                                        <div className={`mt-4 flex items-center gap-2 text-sm font-bold ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                                            Read Article <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                        </div>
                                    </div>
                                </article>
                            </Link>
                        ))}
                    </div>
                </main>
            </div>

            <Footer onAboutClick={() => setShowAboutUs(true)} onFollowClick={() => setShowSocialMedia(true)} />

            <AboutUsModal
                isOpen={showAboutUs}
                onClose={() => setShowAboutUs(false)}
            />
            <SocialMediaModal
                isOpen={showSocialMedia}
                onClose={() => setShowSocialMedia(false)}
            />
            <IntroductionModal // Reused for FAQ
                isOpen={showIntro}
                onClose={() => setShowIntro(false)}
            />
            <Questionnaire // Reused, though mostly for main dashboard
                isOpen={showQuestionnaire}
                onClose={() => setShowQuestionnaire(false)}
                onSubmit={() => setShowQuestionnaire(false)} // Mock submit
            />
        </div>
    );
}
