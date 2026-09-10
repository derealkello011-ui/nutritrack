import { globalStyles } from '@/styles/global'
import React from 'react'
import { ScrollView, Text } from 'react-native'

const Meals = () => {
  return (
      <ScrollView style={globalStyles.innerContainer}>
          <Text style={globalStyles.title}>
              All Meals
          </Text>
    </ScrollView>
  )
}

export default Meals