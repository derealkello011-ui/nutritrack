import { MacroCardProps } from '@/types/types';
import { useTheme } from '@/theme/ThemeProvider';
import { Platform, StyleSheet, Text, View } from 'react-native';

export default function MacroCard({
    label,
    value,
    goal,
    color,
    progress,
}: MacroCardProps) {
    const { colors } = useTheme();
    return (
        <View style={[styles.card, { backgroundColor: colors.surface, borderLeftColor: color }]}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
            <Text style={[styles.value, { color: colors.text }]}>{value}</Text>
            <Text style={[styles.goal, { color: colors.textSecondary }]}>/ {goal}</Text>
            <View style={[styles.progressTrack, { backgroundColor: colors.border }]}>
                <View
                    style={[
                        styles.progressFill,
                        { backgroundColor: color, width: `${Math.min( progress, 1 ) * 100}%` },
                    ]}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#16213e',
        borderRadius: 12,
        padding: Platform.OS === 'android' ? 10 : 16,
        width: '48%', // Ensures 2 items fit per row
        borderLeftWidth: 4,
        marginBottom: Platform.OS === 'android' ? 8 : 12,
    },
    label: {
        fontSize: Platform.OS === 'android' ? 10 : 14,
        color: '#a0a0b0',
    },
    value: {
        fontSize: Platform.OS === 'android' ? 24 : 28,
        fontWeight: 'bold',
        color: '#fff',
        marginTop: 4,
    },
    goal: {
        fontSize: Platform.OS === 'android' ? 10 : 14,
        color: '#a0a0b0',
        marginTop: 2,
    },
    progressTrack: {
        backgroundColor: 'rgba(255, 255, 255, 0.12)',
        borderRadius: 4,
        height: 6,
        marginTop: 10,
        overflow: 'hidden',
    },
    progressFill: {
        borderRadius: 4,
        height: '100%',
    },
});