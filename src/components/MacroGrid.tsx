import { MacroGridProps } from '@/types/types'
import React, { useMemo } from 'react'
import { StyleSheet, View } from 'react-native'
import MacroCard from './MacroCard'

const MacroGrid = ( { meals }: MacroGridProps ) => {
    const totals = useMemo(
        () => meals.reduce(
            ( acc, meal ) => ( {
                calories: acc.calories + meal.calories,
                protein: acc.protein + meal.protein,
                carbs: acc.carbs + meal.carbs,
                fat: acc.fat + meal.fat,
            } ),
            {calories: 0, protein: 0, carbs: 0, fat: 0},
        ),
        [meals],
    );
  return (
      <View style={styles.grid}>
          <MacroCard
            label='Calories'
            value={`${totals.calories} kcal`}
            goal='2,000 kcal'
            color='#ff6b6b'
            progress={totals.calories / 2000}
          />
          <MacroCard 
            label='Protein' 
            value={`${totals.protein}g`}
            goal='150g'
            color='#4ec'
            progress={totals.protein / 150}
          />
          <MacroCard 
            label='Carbs' 
            value={`${totals.carbs}g`} 
            goal='330g'
            color='#ffd93d'
            progress={totals.carbs / 330}
          />
          <MacroCard 
            label='Fat' 
            value={`${totals.fat}g`} 
            goal='65g'
            color='#6bcb77'
            progress={totals.fat / 65}
          />
    </View>
  )
}

export default MacroGrid

const styles = StyleSheet.create( {
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
} );