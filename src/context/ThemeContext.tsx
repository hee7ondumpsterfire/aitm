"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

interface ThemeContextType {
    darkMode: boolean;
    setDarkMode: (value: boolean) => void;
    toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [darkMode, setDarkModeState] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Initial load
    useEffect(() => {
        setMounted(true);
        // 1. Check LocalStorage
        const localTheme = localStorage.getItem('darkMode');
        if (localTheme) {
            setDarkModeState(JSON.parse(localTheme));
        }

        // 2. Check User Profile (Async)
        axios.get('/api/user/settings')
            .then(res => {
                const settings = res.data;
                if (settings && typeof settings.darkMode === 'boolean') {
                    setDarkModeState(settings.darkMode);
                    localStorage.setItem('darkMode', JSON.stringify(settings.darkMode));
                }
            })
            .catch(err => {
                // Not logged in or error, stick to local storage
                console.log('Could not fetch user settings for theme:', err.message);
            });
    }, []);

    const setDarkMode = (value: boolean) => {
        setDarkModeState(value);
        localStorage.setItem('darkMode', JSON.stringify(value));

        // Sync with API (Fire and forget)
        axios.post('/api/user/settings', { darkMode: value })
            .catch(err => console.error('Failed to sync theme setting:', err));
    };

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };



    return (
        <ThemeContext.Provider value={{ darkMode, setDarkMode, toggleDarkMode }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
