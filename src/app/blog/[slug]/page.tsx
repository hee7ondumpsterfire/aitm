'use client';

import { useState, use } from 'react';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AboutUsModal from '@/components/AboutUsModal';
import SocialMediaModal from '@/components/SocialMediaModal';
import IntroductionModal from '@/components/IntroductionModal';
import Questionnaire from '@/components/Questionnaire';
import { Calendar, User as UserIcon, Tag, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { blogPosts } from '@/data/blogPosts';

import { useTheme } from '@/context/ThemeContext';

export default function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const { darkMode, setDarkMode } = useTheme();
    const [showAboutUs, setShowAboutUs] = useState(false);
    const [showSocialMedia, setShowSocialMedia] = useState(false);
    const [showIntro, setShowIntro] = useState(false);
    const [showQuestionnaire, setShowQuestionnaire] = useState(false);

    const post = blogPosts.find(p => p.slug === slug);

    if (!post) {
        notFound();
    }

    return (
        <div className={`min-h-screen flex flex-col transition-colors duration-300 ${darkMode ? 'bg-black text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
            <div className="p-8 max-w-[95%] mx-auto w-full flex-grow">
                <Header
                    darkMode={darkMode}
                    setDarkMode={setDarkMode}
                    onShowIntro={() => setShowIntro(true)}
                    onShowQuestionnaire={() => setShowQuestionnaire(true)}
                    isGuest={true}
                    onShowProfile={() => { }}
                />

                <main className="max-w-4xl mx-auto py-12">
                    <Link href="/blog" className={`inline-flex items-center gap-2 mb-8 ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'} transition-colors`}>
                        <ArrowLeft className="w-4 h-4" /> Back to Blog
                    </Link>

                    <article className={`rounded-3xl overflow-hidden shadow-2xl ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
                        {/* Hero Image */}
                        <div className="relative h-64 md:h-96 w-full">
                            <Image
                                src={post.image}
                                alt={post.title}
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end">
                                <div className="p-8 md:p-12 w-full">
                                    <div className="flex items-center gap-4 text-sm text-gray-300 mb-4 font-medium">
                                        <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {post.date}</span>
                                        <span className="flex items-center gap-1"><UserIcon className="w-4 h-4" /> {post.author}</span>
                                        <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-xs uppercase cursor-default">{post.category}</span>
                                    </div>
                                    <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight">
                                        {post.title}
                                    </h1>
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-8 md:p-12">
                            <div className={`prose prose-lg max-w-none ${darkMode ? 'prose-invert' : ''}`}>
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {post.content}
                                </ReactMarkdown>
                            </div>
                        </div>
                    </article>
                </main>
            </div>

            <Footer onAboutClick={() => setShowAboutUs(true)} onFollowClick={() => setShowSocialMedia(true)} darkMode={darkMode} />

            <AboutUsModal
                isOpen={showAboutUs}
                onClose={() => setShowAboutUs(false)}
            />
            <SocialMediaModal
                isOpen={showSocialMedia}
                onClose={() => setShowSocialMedia(false)}
            />
            <IntroductionModal
                isOpen={showIntro}
                onClose={() => setShowIntro(false)}
            />
            <Questionnaire
                isOpen={showQuestionnaire}
                onClose={() => setShowQuestionnaire(false)}
                onSubmit={() => setShowQuestionnaire(false)}
            />
        </div>
    );
}
