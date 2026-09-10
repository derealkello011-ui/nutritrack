import { deleteMeal } from '@/storage/meals';
// import { MealItemProps } from '@/types/types'
import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity } from 'react-native';

type MealItemProps = {
    id: string,
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    onDelete: () => void;
};
const MealItem = ( {
    id,
    name, 
    calories,
    protein,
    carbs,
    fat,
    onDelete,
}: MealItemProps ) => {
    const handleLongPress = () => {
        Alert.alert( 'Delete Meal', `Are you sure you want to delete ${ name }?`, [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete', style: 'destructive', onPress: async () => {
                    await deleteMeal( id );
                    onDelete();
            }}
        ])
    }

  return (
      <TouchableOpacity
          style={styles.container}
          onLongPress={handleLongPress}
      >
          <Text style={styles.name}> {name}</Text>
          <Text style={styles.macros}>
              {calories} cal ° {protein}g P ° {carbs}g C ° {fat}g F
          </Text>
    </TouchableOpacity>
  )
}

export default MealItem

const styles = StyleSheet.create( {
    container: {
        backgroundColor: '#16213e',
        borderRadius: 10,
        padding: 16,
        marginBottom: 10,
    },
    name: {
        fontSize: 16,
        fontWeight: '600',
        color: "#fff"
    },
    macros: {
        fontSize: 13,
        color: '#a0a0b0',
        marginTop: 4,
    }
    
})