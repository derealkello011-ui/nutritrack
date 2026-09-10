import { Meal } from '@/types/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MEALS_KEY = 'meals';

export const getMeals = async (): Promise<Meal[]> => {
    const data = await AsyncStorage.getItem( MEALS_KEY );
    return data ? JSON.parse( data ) : [];
};

export const addMeal = async (
    meal: Omit<Meal, 'id' | 'createdAt'>,
): Promise<Meal> => {
    const meals = await getMeals();
    const newMeal: Meal = {
        ...meal,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
    };
    await AsyncStorage.setItem( MEALS_KEY, JSON.stringify( [ newMeal, ...meals ] ) );
    return newMeal;
};