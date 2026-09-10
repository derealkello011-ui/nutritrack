import { MacroCardProps } from '@/types/types';
import { StyleSheet, Text, View } from 'react-native';

export default function MacroCard({
    label,
    value,
    goal,
    color
}: MacroCardProps) {
    return (
        <View style={[styles.card, { borderLeftColor: color }]}>
            <Text style={styles.label}>{label}</Text>
            <Text style={styles.value}>{value}</Text>
            <Text style={styles.goal}>/ {goal}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#16213e',
        borderRadius: 12,
        padding: 16,
        width: '48%', // Ensures 2 items fit per row
        borderLeftWidth: 4,
        marginBottom: 12,
    },
    label: {
        fontSize: 14,
        color: '#a0a0b0',
    },
    value: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        marginTop: 4,
    },
    goal: {
        fontSize: 14,
        color: '#a0a0b0',
        marginTop: 2,
    },
});