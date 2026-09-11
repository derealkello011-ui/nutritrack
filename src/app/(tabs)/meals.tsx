import MealItem from '@/components/MealItem';
import { clearAllMeals, getMeals } from '@/storage/meals';
import { globalStyles } from '@/styles/global';
import { useTheme } from '@/theme/ThemeProvider';
import { useAppAlert } from '@/components/AppAlertProvider';
import { Meal } from '@/types/types';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const Meals = () => {
  const { colors } = useTheme();
  const { showAlert } = useAppAlert();
  const [ meals, setMeals ] = useState<Meal[]>( [] );
  
  const loadMeals = useCallback( async () => {
    const data = await getMeals();
    setMeals( data );
  }, []);

  const handleClearAll = async () => {
    showAlert(
      'Clear all meals?',
      'This permanently removes your complete meal history.',
      {
        type: 'warning',
        buttons: [
          { text: 'Cancel', variant: 'cancel' },
          {
            text: 'Clear all',
            variant: 'destructive',
            onPress: async () => {
            await clearAllMeals();
            await loadMeals();
          },
          },
        ],
      },
    );
  };

  useFocusEffect(
    useCallback( () => {
      loadMeals();
    }, [loadMeals] ),
  );

    return (
      <FlatList
        style={[globalStyles.container, { backgroundColor: colors.background }]}
        contentContainerStyle={{ paddingBottom: 120 }}
        data={meals}
        keyExtractor={(meal) => meal.id}
        renderItem={({ item }) => (
          <MealItem
            id={item.id}
            name={item.name}
            calories={item.calories}
            protein={item.protein}
            carbs={item.carbs}
            fat={item.fat}
            onDelete={loadMeals}
          />
        )}
        ListHeaderComponent={
          <Text style={[globalStyles.title, { color: colors.text }]}>All Meals</Text>
        }
        ListEmptyComponent={
          <Text style={[globalStyles.empty, { color: colors.textSecondary }]}>No meals logged yet</Text>
        }
        ListFooterComponent={
          <TouchableOpacity onPress={handleClearAll}>
            <Text style={[styles.clearButton, { color: colors.alert }]}>Clear All</Text>
          </TouchableOpacity>
        }
        ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
      />
  )
}

export default Meals

const styles = StyleSheet.create( {
  clearButton: {
    flex: 1,
    color: '#ff5252',
    fontSize: 16,
    marginTop: 10,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingBlockStart: 5,
    paddingBottom: 5,
    paddingInline: '10%',
    fontWeight: 'bold',
    alignContent: 'center',
    alignSelf: 'center',

  },
  itemSeparator: {
    height: 0,
  }
})