import { useTheme } from "@/theme/ThemeProvider";
import { Meal } from "@/types/types";
import { Ionicons } from "@expo/vector-icons";
import { Share, TouchableOpacity } from "react-native";
import { useMemo } from "react";

type ShareButtonProps = {
    meals: Meal[];
};

export default function ShareButton( { meals }: ShareButtonProps ) {
    const { colors: themeColors } = useTheme();
    const totals = useMemo(
        () => meals.reduce(
            ( acc, meal ) => ( {
                calories: acc.calories + meal.calories,
                protein: acc.protein + meal.protein,
                carbs: acc.carbs + meal.carbs,
                fat: acc.fat + meal.fat,
            } ),
            { calories: 0, protein: 0, carbs: 0, fat: 0 },
        ),
        [meals],
    );

    const handleShare = async () => {
        await Share.share( {
            message: `NutriTrack Daily Summary\n\nCalories: ${ totals.calories } kcal\nProtein: ${ totals.protein }g\nCarbs: ${ totals.carbs }g\nFat: ${ totals.fat }g\n\nMeals: ${meals.length} logged today.\nShared via NutriTrack 😁`
        } );
    };

    return (
        <TouchableOpacity onPress={handleShare}>
            <Ionicons name="share-outline" size={24} color={themeColors.primary} />
        </TouchableOpacity>
    )
}