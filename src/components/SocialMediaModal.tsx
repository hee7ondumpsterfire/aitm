import { X, Instagram, Youtube, Twitter } from 'lucide-react';

interface SocialMediaModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SocialMediaModal({ isOpen, onClose }: SocialMediaModalProps) {
    if (!isOpen) return null;

    const socialLinks = [
        {
            name: 'Instagram',
            url: '#',
            icon: <Instagram className="w-12 h-12" />,
            color: 'text-gray-300 pointer-events-none cursor-not-allowed'
        },
        {
            name: 'YouTube',
            url: 'https://youtube.com/@coachweek?si=U5QQgfw3FCeFxuih',
            icon: <Youtube className="w-12 h-12" />,
            color: 'text-red-600 hover:scale-110'
        },
        {
            name: 'X (Twitter)',
            url: '#',
            icon: <Twitter className="w-12 h-12" />,
            color: 'text-gray-300 pointer-events-none cursor-not-allowed'
        },
        {
            name: 'TikTok',
            url: '#',
            icon: (
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-12 h-12"
                >
                    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                </svg>
            ),
            color: 'text-gray-300 pointer-events-none cursor-not-allowed'
        },
    ];

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white text-gray-900 rounded-3xl w-full max-w-md relative shadow-2xl animate-in fade-in zoom-in duration-200 p-8">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors bg-gray-100 rounded-full p-2 hover:bg-gray-200"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="text-center">
                    <h3 className="text-3xl font-extrabold mb-2 text-[#8B5CF6]">
                        Join the Community
                    </h3>
                    <p className="text-gray-500 mb-10">Use #coachweek and #coachweekworkout to become part of our community.</p>

                    <div className="grid grid-cols-2 gap-6">
                        {socialLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.url}
                                target={link.url !== '#' ? "_blank" : undefined}
                                rel={link.url !== '#' ? "noopener noreferrer" : undefined}
                                className={`flex flex-col items-center justify-center p-6 rounded-2xl bg-gray-50 hover:bg-white border border-transparent hover:border-gray-200 hover:shadow-xl transition-all duration-300 group ${link.color}`}
                                aria-disabled={link.url === '#'}
                            >
                                <div className="mb-3 transition-transform duration-300 transform group-hover:-translate-y-1">
                                    {link.icon}
                                </div>
                                <span className={`text-sm font-semibold ${link.url === '#' ? 'text-gray-400' : 'text-gray-600 group-hover:text-gray-900'}`}>
                                    {link.name}
                                </span>
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
