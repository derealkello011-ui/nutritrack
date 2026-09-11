export type MacroCardProps = {
    label: string,
    value: string,
    goal: string,
    color: string,
    progress: number,
};

export type Meal = {
    id: string,
    name: string,
    calories: number,
    protein: number,
    carbs: number,
    fat: number,
    createdAt: string,
};

export type ReacentMealsProps = {
    meals: Meal[];
    onDelete: () => void;
};

export type MacroGridProps = {
    meals: Meal[];
}

export type MealTemplate = Omit<Meal, 'id' | 'createdAt'> & {
    count: number;
};

export type DailyMealTotal = {
    date: string;
    calories: number;
    protein: number;
};