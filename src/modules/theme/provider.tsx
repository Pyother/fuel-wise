"use client";

// * React and Next:
import { createContext, useContext, useEffect, useState, useMemo } from 'react';
import type { ReactNode } from 'react';

// * Lib:
import { changeTheme } from './lib/changeTheme';

// * Types:
import type { Theme } from './theme.type';

const ThemeContext = createContext<{
    theme: Theme;
    setTheme: (theme: Theme) => void;
} | null>(null);

export default function ThemeProvider(
    { initialTheme, children }:
    { initialTheme: Theme, children: ReactNode }
) {

    const [theme, setTheme] = useState<Theme>(initialTheme);

    useEffect(() => {
        changeTheme(theme);
    }, [theme]);

    const value = useMemo(() => ({ theme, setTheme }), [theme, setTheme]);

    return (
        <ThemeContext.Provider
            value={value}
        >
            {children}
        </ThemeContext.Provider>
    )
}

export function useTheme() {
    const context = useContext(ThemeContext);

    if (context === null) {
        throw new Error('useTheme must be used within ThemeProvider');
    }

    return context;
}
