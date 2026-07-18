import { useState, useEffect } from 'react';

export const useDarkMode = () => {
    const [ isDark, setIsDark] = useState(() => {
        const saved = localStorage.getItem('darkMode');
        return saved === 'true';
    });

    useEffect(() => {
        const root = document.documentElement;
        if(isDark) {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        localStorage.setItem('darkMode', isDark.toString());
    }, [isDark]);

    const toggleDark = () => setIsDark(prev => !prev);
    
    return {isDark, toggleDark };

};