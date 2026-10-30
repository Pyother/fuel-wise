// * React and Next:
import { createContext, useState, ReactNode, useMemo } from 'react';

// * Lib:


// * Types:
import { Theme } from './theme.type';

const ThemeContext = createContext<{
    theme: Theme;
    setTheme: (theme: Theme) => void;
} | null>(null);

export default function ThemeProvider(
    { initialTheme, children }:
    { initialTheme: Theme, children: ReactNode }
) {

    const [theme, setCurrentTheme] = useState<Theme>(initialTheme);

    const setTheme = (theme: Theme) => {

    }

    const value = useMemo(() => ({ theme, setTheme }), [theme, setTheme]);

    return (
        <ThemeContext.Provider
            value={value}
        >
            {children}
        </ThemeContext.Provider>
    )
}
