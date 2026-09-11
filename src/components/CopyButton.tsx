import { useTheme } from "@/theme/ThemeProvider";
import { Meal } from "@/types/types";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { useMemo } from "react";
import { useAppAlert } from '@/components/AppAlertProvider';


type CopyButtonProps = {
    meals: Meal[];
}

export default function CopyButton( { meals }: CopyButtonProps ) {
    const { colors: themeColors } = useTheme();
    const { showAlert } = useAppAlert();
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

    const handleCopy = async () => {
        const summary = `NutriTrack Daily Summary:\n\nCalories: ${ totals.calories } kcal\nProtein: ${ totals.protein }g\nCarbs: ${ totals.carbs }g\nFat: ${ totals.fat }g\n\nMeals: ${ meals.length } logged today.\nShared via NutriTrack 😁`
        
        await Clipboard.setStringAsync( summary );
        Haptics.notificationAsync( Haptics.NotificationFeedbackType.Success );
        showAlert( 'Copied', 'Macro summary copied to clipboard!', { type: 'success' } );
    };

    return (
        <TouchableOpacity style={styles.button} onPress={handleCopy}>
            <Ionicons
                name="copy-outline"
                size={18}
                color={themeColors.primary}
            />
            <Text style={[styles.text, { color: themeColors.primary }]}>
                Copy Summary
            </Text>
        </TouchableOpacity>
    );
}
const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: 16,
    },
    text: {
        fontSize: 14,
    }
});