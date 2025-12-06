'use client';

import Link from 'next/link';

interface FooterProps {
    onAboutClick: () => void;
    onFollowClick?: () => void;
}

export default function Footer({ onAboutClick, onFollowClick }: FooterProps) {
    return (
        <footer className="mt-12 mb-8 grid grid-cols-1 md:grid-cols-4 gap-8 text-gray-500 text-sm max-w-7xl mx-auto px-8 w-full">
            <div>
                <h4 className="font-bold text-gray-900 mb-4">About</h4>
                <ul className="space-y-2">
                    <li><button onClick={onAboutClick} className="hover:text-purple-600 transition">About us</button></li>
                    <li><a href="#" className="hover:text-purple-600 transition">Career</a></li>
                    <li><a href="#" className="hover:text-purple-600 transition">Press</a></li>
                </ul>
            </div>
            <div>
                <h4 className="font-bold text-gray-900 mb-4">Community</h4>
                <ul className="space-y-2">
                    <li><a href="/blog" className="hover:text-purple-600 transition">Blog</a></li>
                    <li><button onClick={onFollowClick} className="hover:text-purple-600 transition">Follow us</button></li>
                    <li><a href="#" className="hover:text-purple-600 transition">Support</a></li>
                </ul>
            </div>
        </footer>
    );
}
