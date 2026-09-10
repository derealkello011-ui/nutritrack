import { MacroGridProps } from '@/types/types'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import MacroCard from './MacroCard'

const MacroGrid = ( { meals }: MacroGridProps ) => {
    const totals = meals.reduce(
        ( acc, meal ) => ( {
            calories: acc.calories + meal.calories,
            protein: acc.protein + meal.calories,
            carbs: acc.carbs + meal.carbs,
            fat: acc.fat + meal.fat,
        } ),
        {calories: 0, protein: 0, carbs: 0, fat: 0},
    );
  return (
      <View style={styles.grid}>
          <MacroCard
            label='Calories'
            value={`${totals.calories}g`}
            goal='2,000g'
            color='#ff6b6b'
          />
          <MacroCard 
            label='Protein' 
            value={`${totals.protein}g`}
            goal='1,500g'
            color='#4ec'
          />
          <MacroCard 
            label='Carbs' 
            value={`${totals.carbs}g`} 
            goal='3,300g'
            color='#ffd93d'
          />
          <MacroCard 
            label='Fat' 
            value={`${totals.fat}g`} 
            goal='65g'
            color='#6bcb77'
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