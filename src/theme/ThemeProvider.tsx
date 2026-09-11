import { getThemePreference, setThemePreference } from '@/storage/settings';
import { ThemePreference } from '@/types/settings';
import React, { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';

export type AppColors = {
    background: string;
    header: string;
    surface: string;
    primary: string;
    text: string;
    textSecondary: string;
    alert: string;
    border: string;
};

const darkColors: AppColors = {
    background: '#1a1a2e',
    header: '#242444',
    surface: '#2a2a4a',
    primary: '#4fc3f7',
    text: '#ffffff',
    textSecondary: '#a0a0b0',
    alert: '#ff5252',
    border: 'rgba(255, 255, 255, 0.1)',
};

const lightColors: AppColors = {
    background: '#f4f7fb',
    header: '#ffffff',
    surface: '#ffffff',
    primary: '#087ea4',
    text: '#172033',
    textSecondary: '#61708a',
    alert: '#d9363e',
    border: 'rgba(23, 32, 51, 0.12)',
};

type ThemeContextValue = {
    preference: ThemePreference;
    resolvedTheme: 'light' | 'dark';
    colors: AppColors;
    setPreference: (value: ThemePreference) => Promise<void>;
};

const ThemeContext = createContext<ThemeContextValue | null>( null );

export const ThemeProvider = ({ children }: PropsWithChildren) => {
    const systemScheme = useColorScheme();
    const [preference, setPreferenceState] = useState<ThemePreference>( 'system' );
    const resolvedTheme = preference === 'system'
        ? (systemScheme === 'light' ? 'light' : 'dark')
        : preference;

    useEffect( () => {
        getThemePreference().then( setPreferenceState );
    }, [] );

    const value = useMemo( () => ({
        preference,
        resolvedTheme,
        colors: resolvedTheme === 'light' ? lightColors : darkColors,
        setPreference: async (next: ThemePreference) => {
            setPreferenceState( next );
            await setThemePreference( next );
        },
    }), [preference, resolvedTheme] );

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextValue => {
    const value = useContext( ThemeContext );
    if ( !value ) throw new Error( 'useTheme must be used within ThemeProvider' );
    return value;
};
