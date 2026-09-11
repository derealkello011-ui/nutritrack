import ProfileAvatar from '@/components/ProfileAvatar';
import { clearAllMeals } from '@/storage/meals';
import { getUserProfile, setUserProfile } from '@/storage/settings';
import { useTheme } from '@/theme/ThemeProvider';
import { defaultProfile, ThemePreference, UserProfile } from '@/types/settings';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import ReminderToggle from '@/components/ReminderToggler';
import { useAppAlert } from '@/components/AppAlertProvider';

const SettingsScreen = () => {
    const { colors, preference, setPreference } = useTheme();
    const { showAlert } = useAppAlert();
    const [profile, setProfile] = useState<UserProfile>( defaultProfile );
    const [draft, setDraft] = useState<UserProfile>( defaultProfile );
    const [saved, setSaved] = useState( false );

    const loadProfile = useCallback( async () => {
        const value = await getUserProfile();
        setProfile( value );
        setDraft( value );
    }, [] );

    useFocusEffect( useCallback( () => {
        loadProfile();
    }, [loadProfile]) );

    const saveProfile = async () => {
        const next = {
            name: draft.name.trim() || defaultProfile.name,
            email: draft.email.trim(),
        };
        await setUserProfile( next );
        setProfile( next );
        setDraft( next );
        setSaved( true );
        setTimeout( () => setSaved( false ), 1800 );
    };

    const confirmClearMeals = () => {
        showAlert(
            'Clear all meals?',
            'This permanently removes your complete meal history.',
            {
                type: 'warning',
                buttons: [
                    { text: 'Cancel', variant: 'cancel' },
                    { text: 'Clear all', variant: 'destructive', onPress: clearAllMeals },
                ],
            },
        );
    };

    return (
        <ScrollView style={[styles.screen, { backgroundColor: colors.background }]} contentContainerStyle={styles.content}>
            <Text style={[styles.title, { color: colors.text }]}>Settings</Text>

            <View style={[styles.profileCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <ProfileAvatar profile={profile} size={58} />
                <View style={styles.profileSummary}>
                    <Text style={[styles.profileName, { color: colors.text }]}>{profile.name}</Text>
                    <Text style={[styles.profileEmail, { color: colors.textSecondary }]}>
                        {profile.email || 'Add an email address'}
                    </Text>
                </View>
            </View>

            <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Profile</Text>
            <TextInput
                value={draft.name}
                onChangeText={(name) => setDraft((current) => ({ ...current, name }))}
                placeholder="Your name"
                placeholderTextColor={colors.textSecondary}
                style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
            />
            <TextInput
                value={draft.email}
                onChangeText={(email) => setDraft((current) => ({ ...current, email }))}
                placeholder="Email (optional)"
                placeholderTextColor={colors.textSecondary}
                keyboardType="email-address"
                autoCapitalize="none"
                style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
            />
            <Pressable style={[styles.primaryButton, { backgroundColor: colors.primary }]} onPress={saveProfile}>
                <Text style={[styles.primaryButtonText, { color: colors.background }]}>
                    {saved ? 'Saved' : 'Save profile'}
                </Text>
            </Pressable>

            <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Appearance</Text>
            <View style={[styles.optionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <View style={styles.optionText}>
                    <Ionicons name="color-palette-outline" size={21} color={colors.primary} />
                    <View>
                        <Text style={[styles.optionTitle, { color: colors.text }]}>Theme</Text>
                        <Text style={[styles.optionSubtitle, { color: colors.textSecondary }]}>Choose how NutriTrack looks</Text>
                    </View>
                </View>
                <View style={styles.themeOptions}>
                    {(['system', 'light', 'dark'] as ThemePreference[]).map((value) => (
                        <Pressable
                            key={value}
                            onPress={() => setPreference(value)}
                            style={[
                                styles.themeButton,
                                { borderColor: colors.border },
                                preference === value && { backgroundColor: colors.primary, borderColor: colors.primary },
                            ]}
                        >
                            <Text style={[
                                styles.themeButtonText,
                                { color: preference === value ? colors.background : colors.textSecondary },
                            ]}>
                                {value[0].toUpperCase() + value.slice(1)}
                            </Text>
                        </Pressable>
                    ))}
                </View>
            </View>

            <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Notifications</Text>
            <View style={[styles.optionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <View style={styles.optionText}>
                    <Ionicons name="notifications-outline" size={21} color={colors.primary} />
                    <View>
                        <Text style={[styles.optionTitle, { color: colors.text }]}>Meal reminders</Text>
                        <Text style={[styles.optionSubtitle, { color: colors.textSecondary }]}>Breakfast, lunch, and dinner prompts</Text>
                    </View>
                </View>
                <ReminderToggle compact />
            </View>

            <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Data</Text>
            <Pressable style={[styles.dangerButton, { borderColor: colors.alert }]} onPress={confirmClearMeals}>
                <Ionicons name="trash-outline" size={20} color={colors.alert} />
                <Text style={[styles.dangerText, { color: colors.alert }]}>Clear all meal history</Text>
            </Pressable>
        </ScrollView>
    );
};

export default SettingsScreen;

const styles = StyleSheet.create( {
    screen: { flex: 1 },
    content: { padding: 20, paddingBottom: 120, paddingTop: 60 },
    title: { fontSize: 30, fontWeight: '800' },
    profileCard: { alignItems: 'center', borderRadius: 16, borderWidth: 1, flexDirection: 'row', marginTop: 24, padding: 16 },
    profileSummary: { marginLeft: 14 },
    profileName: { fontSize: 18, fontWeight: '700' },
    profileEmail: { fontSize: 13, marginTop: 4 },
    sectionTitle: { fontSize: 15, fontWeight: '700', marginBottom: 10, marginTop: 26 },
    input: { borderRadius: 10, borderWidth: 1, fontSize: 16, marginBottom: 10, padding: 14 },
    primaryButton: { alignItems: 'center', borderRadius: 10, padding: 14 },
    primaryButtonText: { fontSize: 16, fontWeight: '700' },
    optionCard: { borderRadius: 14, borderWidth: 1, padding: 14 },
    optionText: { alignItems: 'center', flexDirection: 'row', gap: 12 },
    optionTitle: { fontSize: 16, fontWeight: '600' },
    optionSubtitle: { fontSize: 12, marginTop: 3 },
    themeOptions: { flexDirection: 'row', gap: 8, marginTop: 14 },
    themeButton: { borderRadius: 8, borderWidth: 1, flex: 1, paddingVertical: 9 },
    themeButtonText: { fontSize: 12, textAlign: 'center' },
    dangerButton: { alignItems: 'center', borderRadius: 10, borderWidth: 1, flexDirection: 'row', gap: 10, padding: 14 },
    dangerText: { fontSize: 15, fontWeight: '600' },
} );
