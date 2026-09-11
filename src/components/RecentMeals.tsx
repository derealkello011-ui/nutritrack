import { globalStyles } from '@/styles/global'
import { useTheme } from '@/theme/ThemeProvider'
import { ReacentMealsProps } from '@/types/types'
import React from 'react'
import { FlatList, Text, View } from 'react-native'
import MealItem from './MealItem'

const RecentMeals = ( {
    meals, onDelete
}: ReacentMealsProps) => {
  const { colors } = useTheme();
  return (
      <View style={{marginTop: 30,}}>
          <Text style={[globalStyles.sectionTitle, { color: colors.textSecondary }]}>
              Recent Meals
          </Text>
          <FlatList
              data={meals.slice( 0, 5 )}
              keyExtractor={(meal) => meal.id}
              scrollEnabled={false}
              ListEmptyComponent={
                  <Text style={[globalStyles.empty, { color: colors.textSecondary }]}>No meals logged yet.</Text>
              }
              renderItem={({ item: meal }) => (
                      <MealItem
                          id={meal.id}
                          name={meal.name}
                          calories={meal.calories}
                          protein={meal.protein}
                          carbs={meal.carbs}
                          fat={meal.fat}
                          onDelete={onDelete}
                      />
              )}
          />
    </View>
  )
}

export default RecentMeals