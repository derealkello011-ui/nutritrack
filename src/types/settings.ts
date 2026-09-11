export type ThemePreference = 'system' | 'light' | 'dark';

export type UserProfile = {
    name: string;
    email: string;
};

export const defaultProfile: UserProfile = {
    name: 'NutriTrack User',
    email: '',
};
