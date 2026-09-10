import React from 'react'
import { StyleSheet, View } from 'react-native'
import MacroCard from './MacroCard'

const MacroGrid = () => {
  return (
      <View style={styles.grid}>
          <MacroCard label='Calories' value='0g' goal='2,000g' color='#ff6b6b' />
          <MacroCard label='Protein' value='12g' goal='1,500g' color='#4ec' />
          <MacroCard label='Carbo' value='0g' goal='3,300g' color='#ffd93d' />
          <MacroCard label='Fat' value='0g' goal='65g' color='#6bcb77' />
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