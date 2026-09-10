import { globalStyles } from '@/styles/global'
import { ReacentMealsProps } from '@/types/types'
import React from 'react'
import { Text, View } from 'react-native'
import MealItem from './MealItem'

const RecentMeals = ( {
    meals, onDelete
}: ReacentMealsProps) => {
  return (
      <View style={{
          marginTop: 30,
      }}>
          <Text style={globalStyles.sectionTitle}>
              Recent Meals
          </Text>
          {meals.length === 0 ? (
              <Text style={globalStyles.empty}>
                  No meals logged yet.
              </Text>
          ) : (
                  meals.slice( 0, 5 ).map( ( meal ) => (
                      <MealItem
                          key={meal.id}
                          id={meal.id}
                          name={meal.name}
                          calories={meal.calories}
                          protein={meal.protein}
                          carbs={meal.carbs}
                          fat={meal.fat}
                          onDelete={onDelete}
                      />
                    )))
            };

          {/* <MealItem
              name='Araba Plantain Chips'
              calories={600}
              protein={23}
              carbs={65}
              fat={23}
          />
          <MealItem
              name='Maria Special Homemade'
              calories={540}
              protein={45}
              carbs={50}
              fat={12}
          />
          <MealItem
              name='Chrisbae Protein Shake'
              calories={280}
              protein={30}
              carbs={20}
              fat={10}
          />
          <MealItem
              name='Schola Salad'
              calories={430}
              protein={35}
              carbs={10}
              fat={25}
          />
          <MealItem
              name='Dereal Cake'
              calories={500}
              protein={50}
              carbs={89}
              fat={20}
          />
          <MealItem
              name='BAGS HungryMan Pizza'
              calories={547}
              protein={45}
              carbs={34}
              fat={17}
          /> */}
    </View>
  )
}

export default RecentMeals