import { colors } from '@/styles/global';
import { useTheme } from '@/theme/ThemeProvider';
import { MealTemplate } from '@/types/types';
import React, { memo } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type FrequentMealsProps = {
    templates: MealTemplate[];
    onSelect: (template: MealTemplate) => void;
};

const FrequentMeals = ({ templates, onSelect }: FrequentMealsProps) => {
    const { colors: themeColors } = useTheme();
    if ( templates.length === 0 ) return null;

    return (
        <View style={styles.container}>
            <Text style={[styles.title, { color: themeColors.textSecondary }]}>Frequently Logged</Text>
            <FlatList
                data={templates}
                horizontal
                keyExtractor={(item) => `${item.name}-${item.calories}-${item.protein}`}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.list}
                renderItem={({ item }) => (
                    <TouchableOpacity style={[styles.card, { backgroundColor: themeColors.surface, borderColor: themeColors.border }]} onPress={() => onSelect( item )}>
                        <Text style={[styles.name, { color: themeColors.text }]} numberOfLines={1}>{item.name}</Text>
                        <Text style={[styles.details, { color: themeColors.primary }]}>
                            {item.calories} kcal · {item.protein}g protein
                        </Text>
                        <Text style={[styles.count, { color: themeColors.textSecondary }]}>Used {item.count} times</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
};

export default memo( FrequentMeals );

const styles = StyleSheet.create( {
    container: {
        marginTop: 20,
    },
    title: {
        color: colors.textSecondary,
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 10,
    },
    list: {
        gap: 10,
    },
    card: {
        backgroundColor: colors.surface,
        borderColor: 'rgba(255, 255, 255, 0.08)',
        borderRadius: 12,
        borderWidth: 1,
        padding: 12,
        width: 190,
    },
    name: {
        color: colors.text,
        fontSize: 15,
        fontWeight: '600',
    },
    details: {
        color: colors.primary,
        fontSize: 12,
        marginTop: 7,
    },
    count: {
        color: colors.textSecondary,
        fontSize: 11,
        marginTop: 5,
    },
} );
