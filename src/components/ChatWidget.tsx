
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import axios from 'axios';
import { blogPosts } from '../data/blogPosts';
import { fallbackQA } from '../data/fallbackQA';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

interface ChatWidgetProps {
    contextData: any;
}

export default function ChatWidget({ contextData }: ChatWidgetProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: "Hi! I'm Coach Juno. How can I help you with your training today?" }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [pendingQuestions, setPendingQuestions] = useState<string[]>([]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const formatContext = () => {
        // Strip heavy arrays like activity lists to save tokens, keep summary stats
        const { activities, ...summary } = contextData;

        // Add minimal recent activity info
        const recentActivities = activities?.slice(0, 3).map((a: any) => ({
            name: a.name,
            date: a.start_date,
            distance: a.distance,
            type: a.type
        }));

        return {
            ...summary,
            recentActivities
        };
    };

    // Retry Mechanism: Poll every 30m if there are pending questions
    useEffect(() => {
        if (pendingQuestions.length === 0) return;

        const interval = setInterval(async () => {
            // Simple connectivity check
            try {
                // Determine if we can reach the API
                const questionToRetry = pendingQuestions[0];
                const safeContext = formatContext();
                const response = await axios.post('/api/ai/chat', {
                    messages: [...messages, { role: 'user', content: questionToRetry }],
                    context: safeContext
                });

                // If successful:
                if (response.status === 200) {
                    setMessages(prev => [...prev, {
                        role: 'assistant',
                        content: `**Update on your earlier question:** "${questionToRetry}"\n\n${response.data.reply}`
                    }]);
                    setPendingQuestions(prev => prev.slice(1)); // Remove from queue
                }
            } catch (e) {
                console.log('Retry failed, still offline...');
            }
        }, 1800000); // Check every 30 minutes

        return () => clearInterval(interval);
    }, [pendingQuestions, messages, contextData]);

    const checkLocalResponse = (msg: string): string | null => {
        const lowerMsg = msg.toLowerCase().trim();

        // 1. Greetings
        if (['hi', 'hello', 'hey', 'good morning', 'good evening'].some(g => lowerMsg.startsWith(g))) {
            return "Hello! I'm ready to analyze your training. How are you feeling today?";
        }

        // 2. Identity
        if (lowerMsg.includes('who are you') || lowerMsg.includes('your name')) {
            return "I'm Coach Juno, your personal AI training assistant. I can help analyze your Strava data, suggest plans, and answer fitness questions.";
        }

        // 3. User Profile / Settings
        if (lowerMsg.includes('profile') || lowerMsg.includes('settings') || lowerMsg.includes('username') || lowerMsg.includes('account') || ((lowerMsg.includes('ftp') || lowerMsg.includes('weight')) && (lowerMsg.includes('my') || lowerMsg.includes('current')))) {
            const ftp = contextData.userSettings?.ftp || 'not set';
            const weight = contextData.userSettings?.weight || 'not set';
            return `You can manage your profile in the top right corner. \n\n**Current Settings:**\n- **FTP**: ${ftp} W\n- **Weight**: ${weight} kg\n\nNeed to update these? Click your profile picture!`;
        }

        // 4. Diagram Explanations
        if (lowerMsg.includes('pie chart') || (lowerMsg.includes('distribution') && lowerMsg.includes('activity'))) {
            return "That's the **Activity Distribution** chart. It shows how much time you spend in each sport (Ride, Run, Swim) based on your recent activity history.";
        }
        if (lowerMsg.includes('zone') && (lowerMsg.includes('chart') || lowerMsg.includes('graph'))) {
            return "The **Heart Rate Zones** chart helps you visualize your training intensity. A 'Polarized' approach usually means spending ~80% of time in Zone 1/2 (easy) and 20% in Zone 5 (hard), avoiding the 'middle ground'.";
        }
        if (lowerMsg.includes('tss') && lowerMsg.includes('weekly')) {
            return "The **Weekly TSS** chart tracks your Training Stress Score over time. The trendline helps you see if your training load is progressively increasing (good) or stalling.";
        }
        if (lowerMsg.includes('w/kg') || lowerMsg.includes('power profile')) {
            return "The **W/kg Profile** compares your power output to other cyclists. It helps identify your strengths (e.g., Sprint vs. Endurance) and areas for improvement.";
        }

        // 5. Blog Recommendations (Dynamic Registry)
        const matchedPost = blogPosts.find(post =>
            post.tags.some(tag => lowerMsg.includes(tag.toLowerCase())) ||
            post.title.toLowerCase().includes(lowerMsg)
        );

        if (matchedPost) {
            return `That's a great topic! \n\nI recommend reading our article: **[${matchedPost.title}](/blog/${matchedPost.slug})**.\n\nIt covers everything you need to know about ${matchedPost.tags[0]}!`;
        }

        // 6. Navigation (Simple)
        if (lowerMsg === 'help' || lowerMsg.includes('what can you do')) {
            return "I can help with:\n\n- **Data Analysis**: Ask about your TSS, zones, or recent activities.\n- **Knowledge**: Ask about cardiac drift, polarization, or recovery.\n- **Planning**: Ask for a training plan adjustment based on your fatigue.";
        }

        // Status
        if (lowerMsg.includes('how are you')) {
            return "I'm functioning perfectly and ready to help you get faster! How is your training going?";
        }

        return null; // No local match found
    };

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = input;
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setIsTyping(true);

        // 1. Check Local Responses (No-Code/Zero-Cost)
        const localReply = checkLocalResponse(userMsg);
        if (localReply) {
            // Simulate reading delay
            setTimeout(() => {
                setMessages(prev => [...prev, { role: 'assistant', content: localReply }]);
                setIsTyping(false);
            }, 600);
            return;
        }

        try {
            const safeContext = formatContext();

            // Pass full history + context to API
            const response = await axios.post('/api/ai/chat', {
                messages: [...messages, { role: 'user', content: userMsg }],
                context: safeContext
            });

            setMessages(prev => [...prev, { role: 'assistant', content: response.data.reply }]);
        } catch (error) {
            console.error('Chat failed', error);

            // FALLBACK LOGIC
            const lowerMsg = userMsg.toLowerCase();
            const fallbackMatch = fallbackQA.find(qa => qa.keywords.some(k => lowerMsg.includes(k)));

            let reply = '';

            if (fallbackMatch) {
                reply = `${fallbackMatch.answer}\n\n---\n*Note: The AI service is currently unavailable. I've provided a standard answer from my library.*`;
            } else {
                reply = "I'm having trouble connecting to the AI service right now.";
            }

            reply += `\n\nI have **noted your question** and will try to get you a full answer as soon as the connection is restored.`;

            setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
            setPendingQuestions(prev => [...prev, userMsg]); // Add to retry queue

        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {/* Chat Window */}
            {isOpen && (
                <div className="bg-white rounded-2xl shadow-2xl w-80 sm:w-96 h-[500px] mb-4 flex flex-col border border-gray-200 animate-in slide-in-from-bottom-10 fade-in duration-200 overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4 text-white flex justify-between items-center shrink-0">
                        <div className="flex items-center gap-2">
                            <div className="bg-white/20 p-1.5 rounded-lg">
                                <Bot className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h3 className="font-bold text-sm">Coach Juno</h3>
                                <div className="flex items-center gap-1.5 opacity-80">
                                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                                    <span className="text-xs">Online</span>
                                </div>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`
                                    max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm
                                    ${msg.role === 'user'
                                        ? 'bg-purple-600 text-white rounded-tr-none'
                                        : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'}
                                `}>
                                    <div className="prose prose-sm prose-invert">
                                        <ReactMarkdown
                                            components={{
                                                p: ({ node, ...props }) => <p className="mb-0 leading-relaxed" {...props} />,
                                                a: ({ node, ...props }) => <a className="underline font-bold" {...props} />
                                            }}
                                        >
                                            {msg.content}
                                        </ReactMarkdown>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm flex gap-1 items-center">
                                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-75"></span>
                                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-3 bg-white border-t border-gray-100 shrink-0">
                        <div className="flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2 focus-within:ring-2 focus-within:ring-purple-500/20 transition-all border border-transparent focus-within:border-purple-500">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Ask about your training..."
                                className="flex-1 bg-transparent text-sm focus:outline-none text-gray-800 placeholder-gray-400"
                                disabled={isTyping}
                            />
                            <button
                                onClick={handleSend}
                                disabled={!input.trim() || isTyping}
                                className="p-1.5 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    shadow-lg hover:shadow-xl transition-all duration-300
                    flex items-center justify-center
                    ${isOpen ? 'w-12 h-12 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300' : 'w-14 h-14 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:scale-105'}
                `}
            >
                {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-7 h-7" />}
            </button>
        </div>
    );
}
