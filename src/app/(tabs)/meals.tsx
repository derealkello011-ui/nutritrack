import MealItem from '@/components/MealItem';
import { clearAllMeals, getMeals } from '@/storage/meals';
import { globalStyles } from '@/styles/global';
import { Meal } from '@/types/types';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const Meals = () => {
  const [ meals, setMeals ] = useState<Meal[]>( [] );
  
  const loadMeals = async () => {
    const data = await getMeals();
    setMeals( data );
  };

  const handleClearAll = async () => {
    await clearAllMeals();
    loadMeals();
  };

  useFocusEffect(
    useCallback( () => {
      loadMeals();
    }, [] ),
  );

    return (
      <ScrollView style={globalStyles.container}>
          <Text style={globalStyles.title}> 
              All Meals
        </Text>
        
        <View style={{marginTop: 30}}>
          {meals.length === 0 ? (
            <Text style={globalStyles.empty}>No meals logged yet</Text>
          ) : (
              meals.map( ( meal ) => (
                <MealItem
                  key={meal.id}
                  id={meal.id}
                  name={meal.name}
                  calories={meal.calories}
                  protein={meal.protein}
                  carbs={meal.carbs}
                  fat={meal.fat}
                  onDelete={loadMeals}
                />
              ))
          )}
        </View>
        <TouchableOpacity onPress={handleClearAll} >
          <Text style={styles.clearButton}>
            Clear All
          </Text>
        </TouchableOpacity>
    </ScrollView>
  )
}

export default Meals

const styles = StyleSheet.create( {
  clearButton: {
    flex: 1,
    color: 'red',
    fontSize: 16,
    marginTop: 10,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingBlockStart: 5,
    paddingBottom: 5,
    paddingInline: '10%',
    fontWeight: 'bold',
    alignContent: 'center',
    alignSelf: 'center',

  }
})