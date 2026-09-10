import { colors } from "@/styles/global";
import { Meal } from "@/types/types";
import { Ionicons } from "@expo/vector-icons";
import { Share, TouchableOpacity } from "react-native";

type ShareButtonProps = {
    meals: Meal[];
};

export default function ShareButton( { meals }: ShareButtonProps ) {
    const handleShare = async () => {
        const totals = meals.reduce(
            ( acc, meal ) => ( {
                calories: acc.calories + meal.calories,
                protein: acc.protein + meal.protein,
                carbs: acc.carbs + meal.carbs,
                fat: acc.fat + meal.fat,
            } ),
            { calories: 0, protein: 0, carbs: 0, fat: 0 },
        );
        await Share.share( {
            message: `NutriTrack Daily Summary\n\nCalories: ${ totals.calories }\nProtein: ${ totals.protein }\nCarbs: ${ totals.carbs }\nFat: ${ totals.fat }\n\nMeals: ${meals.length} logged today.\nCreated by d3r3alk3ll0 😁`
        } );
    };

    return (
        <TouchableOpacity onPress={handleShare}>
            <Ionicons name="share-outline" size={24} color={colors.primary} />
        </TouchableOpacity>
    )
}