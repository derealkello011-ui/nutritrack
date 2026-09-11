import { colors } from '@/styles/global';
import { useTheme } from '@/theme/ThemeProvider';
import { DailyMealTotal } from '@/types/types';
import React, { memo, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

type WeeklyTrendsProps = {
    totals: DailyMealTotal[];
};

const WeeklyTrends = ({ totals }: WeeklyTrendsProps) => {
    const { colors: themeColors } = useTheme();
    const maxCalories = useMemo(
        () => Math.max( 2000, ...totals.map( (day) => day.calories ) ),
        [totals],
    );

    return (
        <View style={[styles.container, { backgroundColor: themeColors.surface }]}>
            <Text style={[styles.title, { color: themeColors.text }]}>Weekly Trends</Text>
            <View style={styles.legend}>
                <View style={[styles.legendDot, { backgroundColor: themeColors.primary }]} />
                <Text style={[styles.legendText, { color: themeColors.textSecondary }]}>Calories</Text>
                <View style={[styles.legendDot, { backgroundColor: '#ff6b6b' }]} />
                <Text style={[styles.legendText, { color: themeColors.textSecondary }]}>Protein</Text>
            </View>
            <View style={styles.chart}>
                {totals.map( (day) => {
                    const caloriesHeight = (day.calories / maxCalories) * 112;
                    const proteinHeight = Math.min( day.protein / 150, 1 ) * 112;
                    const label = new Date( `${day.date}T12:00:00` ).toLocaleDateString( 'en-US', { weekday: 'short' } );

                    return (
                        <View key={day.date} style={styles.column}>
                            <View style={styles.bars}>
                                <View style={[styles.bar, { backgroundColor: themeColors.primary, height: caloriesHeight }]} />
                                <View style={[styles.bar, styles.proteinBar, { height: proteinHeight }]} />
                            </View>
                            <Text style={[styles.day, { color: themeColors.textSecondary }]}>{label}</Text>
                        </View>
                    );
                }) }
            </View>
        </View>
    );
};

export default memo( WeeklyTrends );

const styles = StyleSheet.create( {
    container: {
        backgroundColor: '#16213e',
        borderRadius: 12,
        marginTop: 24,
        padding: 16,
    },
    title: {
        color: colors.text,
        fontSize: 18,
        fontWeight: '600',
    },
    legend: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: 6,
        marginTop: 10,
    },
    legendDot: {
        borderRadius: 4,
        height: 8,
        width: 8,
    },
    legendText: {
        color: colors.textSecondary,
        fontSize: 12,
        marginRight: 8,
    },
    chart: {
        alignItems: 'flex-end',
        flexDirection: 'row',
        height: 140,
        justifyContent: 'space-between',
        marginTop: 12,
    },
    column: {
        alignItems: 'center',
        flex: 1,
    },
    bars: {
        alignItems: 'flex-end',
        flexDirection: 'row',
        gap: 3,
        height: 112,
    },
    bar: {
        borderRadius: 3,
        width: 8,
    },
    calorieBar: {
        backgroundColor: colors.primary,
    },
    proteinBar: {
        backgroundColor: '#ff6b6b',
    },
    day: {
        color: colors.textSecondary,
        fontSize: 11,
        marginTop: 8,
    },
} );
