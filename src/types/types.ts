export type MacroCardProps = {
    label: string,
    value: string,
    goal: string,
    color: string
};

export type MealItemProps = {
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
};

export type Meal = {
    id: string,
    name: string,
    calories: number,
    protein: number,
    carbs: number,
    fat: number,
    createdAt: string,
}