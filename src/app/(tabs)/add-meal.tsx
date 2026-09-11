import FrequentMeals from '@/components/FrequentMeals';
import { useAppAlert } from '@/components/AppAlertProvider';
import { globalStyles } from '@/styles/global';
import { addMeal, getFrequentMeals } from '@/storage/meals';
import { dateFromKey, formatDateLabel } from '@/utils/date';
import { MealTemplate } from '@/types/types';
import { useTheme } from '@/theme/ThemeProvider';
import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const AddMealScreen = () => {
  const { colors } = useTheme();
  const { showAlert } = useAppAlert();
  const { date } = useLocalSearchParams<{ date?: string }>();
  const selectedDate = typeof date === 'string' ? dateFromKey( date ) : null;
  const [name, setName] = useState("");
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fat, setFat] = useState("");
  const [frequentMeals, setFrequentMeals] = useState<MealTemplate[]>( [] );

  useEffect( () => {
    getFrequentMeals().then( setFrequentMeals );
  }, [] );

  const handleTemplateSelect = (template: MealTemplate) => {
    setName( template.name );
    setCalories( String( template.calories ) );
    setProtein( String( template.protein ) );
    setCarbs( String( template.carbs ) );
    setFat( String( template.fat ) );
  };

  const handleAddMeal = async () => {
    if (name.trim() === "" || calories === "" || protein === "" || carbs === "" || fat === "") {
      showAlert(
        "Missing Information",
        "One or more of the items is missing. Please complete all fields.",
        { type: 'error' }
      );
    } else {
      const numericValues = [calories, protein, carbs, fat].map( Number );
      if ( numericValues.some( (value) => !Number.isFinite( value ) || value < 0 ) ) {
        showAlert(
          "Invalid Nutrition Values",
          "Calories and macros must be valid non-negative numbers.",
          { type: 'error' }
        );
        return;
      }

      const mealDate = selectedDate
        ? new Date(
          selectedDate.getFullYear(),
          selectedDate.getMonth(),
          selectedDate.getDate(),
          12,
        ).toISOString()
        : undefined;

      await addMeal(
        {
          name,
          calories: Number(calories),
          protein: Number(protein) || 0,
          carbs: Number(carbs) || 0,
          fat: Number(fat) || 0,
        },
        mealDate,
      );

      // Clear form inputs
      setName('');
      setCalories('');
      setProtein('');
      setCarbs('');
      setFat('');

      // Show success alert and defer router navigation until the user taps 'OK'
      showAlert(
        "Meal Added",
        "Meal added successfully!",
        {
          type: 'success',
          buttons: [{
            text: 'Continue',
            variant: 'default',
            onPress: () => {
              Haptics.notificationAsync( Haptics.NotificationFeedbackType.Success );
              router.push( '/' );
            },
          }],
        },
      );
    }
  };

  return (
    <View style={globalStyles.container}>
      <Text style={[globalStyles.title, { color: colors.text }]}>
        Add Meal{selectedDate ? ` for ${formatDateLabel( selectedDate )}` : ''}
      </Text>

      <FrequentMeals templates={frequentMeals} onSelect={handleTemplateSelect} />
      
      <TextInput
        style={[style.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text, marginTop: 20 }]}
        placeholder='Meal name'
        placeholderTextColor={colors.textSecondary}
        value={name}
        onChangeText={setName}
      />
      
      <TextInput
        style={[style.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
        placeholder='Calories'
        placeholderTextColor={colors.textSecondary}
        keyboardType='numeric'
        value={calories}
        onChangeText={setCalories}
      />
      
      <View style={style.row}>
        <TextInput
          style={[style.input, style.rowInput, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
          placeholder='Protein (g)'
          placeholderTextColor={colors.textSecondary}
          keyboardType='numeric'
          value={protein}
          onChangeText={setProtein}
        />
        
        <TextInput
          style={[style.input, style.rowInput, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
          placeholder='Carbs (g)'
          placeholderTextColor={colors.textSecondary}
          keyboardType='numeric'
          value={carbs}
          onChangeText={setCarbs}
        />
        
        <TextInput
          style={[style.input, style.rowInput, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
          placeholder='Fat (g)'
          placeholderTextColor={colors.textSecondary}
          keyboardType='numeric'
          value={fat}
          onChangeText={setFat}
        />
      </View>

      <TouchableOpacity
        style={[style.button, { backgroundColor: colors.primary }]}
        onPress={handleAddMeal}
      >
        <Text style={[style.buttonText, { color: colors.background }]}>
          Add Meal
        </Text>
      </TouchableOpacity>

    </View>
  );
};

export default AddMealScreen;

const style = StyleSheet.create({
  input: {
    backgroundColor: '#ffffff',
    color: '#172033',
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    marginTop: 16,
    borderColor: 'rgba(23, 32, 51, 0.12)',
    borderWidth: 1,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  rowInput: {
    flex: 1,
  },
  buttonText: {
    color: '#172033',
    fontSize: 16,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#087ea4',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
});