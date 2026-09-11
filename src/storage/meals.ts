import { DailyMealTotal, Meal, MealTemplate } from '@/types/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SQLite from 'expo-sqlite';

const MEALS_KEY = 'meals';
const DATABASE_NAME = 'nutritrack.db';

type MealRow = {
    id: string;
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    createdAt: string;
};

let databasePromise: Promise<SQLite.SQLiteDatabase> | null = null;

const getDatabase = async (): Promise<SQLite.SQLiteDatabase> => {
    if ( !databasePromise ) {
        databasePromise = ( async () => {
            const database = await SQLite.openDatabaseAsync( DATABASE_NAME );
            await database.execAsync( `
                PRAGMA journal_mode = WAL;
                CREATE TABLE IF NOT EXISTS meals (
                    id TEXT PRIMARY KEY NOT NULL,
                    name TEXT NOT NULL,
                    calories REAL NOT NULL,
                    protein REAL NOT NULL,
                    carbs REAL NOT NULL,
                    fat REAL NOT NULL,
                    createdAt TEXT NOT NULL
                );
                CREATE INDEX IF NOT EXISTS meals_created_at_idx
                    ON meals (createdAt);
            ` );
            await migrateMeals( database );
            return database;
        } )();
    }

    return databasePromise;
};

const migrateMeals = async (database: SQLite.SQLiteDatabase): Promise<void> => {
    const existingMeals = await AsyncStorage.getItem( MEALS_KEY );
    if ( !existingMeals ) return;

    let meals: Meal[];
    try {
        const parsed = JSON.parse( existingMeals );
        meals = Array.isArray( parsed ) ? parsed : [];
    } catch {
        console.error( 'Unable to migrate legacy meals: stored data is not valid JSON.' );
        return;
    }
    if ( meals.length > 0 ) {
        await database.withTransactionAsync( async () => {
            for ( const meal of meals ) {
                await database.runAsync(
                    `INSERT OR IGNORE INTO meals
                        (id, name, calories, protein, carbs, fat, createdAt)
                     VALUES (?, ?, ?, ?, ?, ?, ?)`,
                    meal.id,
                    meal.name,
                    meal.calories,
                    meal.protein,
                    meal.carbs,
                    meal.fat,
                    meal.createdAt,
                );
            }
        } );
    }

    await AsyncStorage.removeItem( MEALS_KEY );
};

const mapMealRow = (row: MealRow): Meal => ({
    id: row.id,
    name: row.name,
    calories: Number( row.calories ),
    protein: Number( row.protein ),
    carbs: Number( row.carbs ),
    fat: Number( row.fat ),
    createdAt: row.createdAt,
});

export const getMeals = async (): Promise<Meal[]> => {
    const database = await getDatabase();
    const rows = await database.getAllAsync<MealRow>(
        'SELECT * FROM meals ORDER BY createdAt DESC',
    );

    return rows.map( mapMealRow );
};

export const getMealsForDate = async (date: Date): Promise<Meal[]> => {
    const database = await getDatabase();
    const start = new Date( date.getFullYear(), date.getMonth(), date.getDate() );
    const end = new Date( date.getFullYear(), date.getMonth(), date.getDate() + 1 );
    const rows = await database.getAllAsync<MealRow>(
        `SELECT * FROM meals
         WHERE createdAt >= ? AND createdAt < ?
         ORDER BY createdAt DESC`,
        start.toISOString(),
        end.toISOString(),
    );

    return rows.map( mapMealRow );
};

export const getFrequentMeals = async (limit = 6): Promise<MealTemplate[]> => {
    const database = await getDatabase();
    const rows = await database.getAllAsync<MealTemplate>(
        `SELECT
            name,
            calories,
            protein,
            carbs,
            fat,
            COUNT(*) AS count
         FROM meals
         GROUP BY name, calories, protein, carbs, fat
         ORDER BY count DESC, MAX(createdAt) DESC
         LIMIT ?`,
        limit,
    );

    return rows.map( (row) => ({
        ...row,
        calories: Number( row.calories ),
        protein: Number( row.protein ),
        carbs: Number( row.carbs ),
        fat: Number( row.fat ),
        count: Number( row.count ),
    }) );
};

export const getDailyMealTotals = async (endDate = new Date(), days = 7): Promise<DailyMealTotal[]> => {
    const database = await getDatabase();
    const end = new Date( endDate.getFullYear(), endDate.getMonth(), endDate.getDate() + 1 );
    const start = new Date( end.getFullYear(), end.getMonth(), end.getDate() - ( days - 1 ) );
    const rows = await database.getAllAsync<MealRow>(
        `SELECT * FROM meals
         WHERE createdAt >= ? AND createdAt < ?
         ORDER BY createdAt ASC`,
        start.toISOString(),
        end.toISOString(),
    );
    const totals = new Map<string, DailyMealTotal>();

    for ( const meal of rows.map( mapMealRow ) ) {
        const mealDate = new Date( meal.createdAt );
        const date = `${ mealDate.getFullYear() }-${ String( mealDate.getMonth() + 1 ).padStart( 2, '0' ) }-${ String( mealDate.getDate() ).padStart( 2, '0' ) }`;
        const current = totals.get( date ) ?? { date, calories: 0, protein: 0 };
        current.calories += meal.calories;
        current.protein += meal.protein;
        totals.set( date, current );
    }

    return Array.from( { length: days }, ( _, index ) => {
        const date = new Date( start.getFullYear(), start.getMonth(), start.getDate() + index );
        const key = `${ date.getFullYear() }-${ String( date.getMonth() + 1 ).padStart( 2, '0' ) }-${ String( date.getDate() ).padStart( 2, '0' ) }`;
        return totals.get( key ) ?? { date: key, calories: 0, protein: 0 };
    } );
};

export const addMeal = async (
    meal: Omit<Meal, 'id' | 'createdAt'>,
    createdAt = new Date().toISOString(),
): Promise<Meal> => {
    const database = await getDatabase();
    const newMeal: Meal = {
        ...meal,
        id: Date.now().toString(),
        createdAt,
    };

    await database.runAsync(
        `INSERT INTO meals
            (id, name, calories, protein, carbs, fat, createdAt)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        newMeal.id,
        newMeal.name,
        newMeal.calories,
        newMeal.protein,
        newMeal.carbs,
        newMeal.fat,
        newMeal.createdAt,
    );

    return newMeal;
};

export const deleteMeal = async (id: string): Promise<void> => {
    const database = await getDatabase();
    await database.runAsync( 'DELETE FROM meals WHERE id = ?', id );
};

export const clearAllMeals = async (): Promise<void> => {
    const database = await getDatabase();
    await database.runAsync( 'DELETE FROM meals' );
};
