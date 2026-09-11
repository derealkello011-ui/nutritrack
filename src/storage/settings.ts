import { defaultProfile, ThemePreference, UserProfile } from '@/types/settings';
import AsyncStorage from '@react-native-async-storage/async-storage';

const THEME_KEY = 'themePreference';
const PROFILE_KEY = 'userProfile';

export const getThemePreference = async (): Promise<ThemePreference> => {
    const value = await AsyncStorage.getItem( THEME_KEY );
    return value === 'light' || value === 'dark' || value === 'system' ? value : 'system';
};

export const setThemePreference = async (value: ThemePreference): Promise<void> => {
    await AsyncStorage.setItem( THEME_KEY, value );
};

export const getUserProfile = async (): Promise<UserProfile> => {
    const value = await AsyncStorage.getItem( PROFILE_KEY );
    if ( !value ) return defaultProfile;

    try {
        const parsed = JSON.parse( value ) as Partial<UserProfile>;
        return {
            name: parsed.name?.trim() || defaultProfile.name,
            email: parsed.email?.trim() || '',
        };
    } catch {
        return defaultProfile;
    }
};

export const setUserProfile = async (profile: UserProfile): Promise<void> => {
    await AsyncStorage.setItem( PROFILE_KEY, JSON.stringify( profile ) );
};
