import { useEffect } from 'react';
import useLocalStorage from './useLocalStorage';

export function useTheme() {
    const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('theme', 'light');

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove(theme === 'dark' ? 'light' : 'dark');
        root.classList.add(theme);
    }, [theme]);

    return [theme, setTheme] as const;
}