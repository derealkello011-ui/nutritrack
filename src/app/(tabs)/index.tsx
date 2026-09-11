import CopyButton from "@/components/CopyButton";
import HomeHeader from "@/components/HomeHeader";
import MacroGrid from "@/components/MacroGrid";
import RecentMeals from "@/components/RecentMeals";
import ReminderToggle from "@/components/ReminderToggler";
import ShareButton from "@/components/ShareButton";
import WeeklyTrends from "@/components/WeeklyTrends";
import ProfileAvatar from "@/components/ProfileAvatar";
import { getUserProfile } from "@/storage/settings";
import { getDailyMealTotals, getMealsForDate } from "@/storage/meals";
import { globalStyles } from "@/styles/global";
import { startOfDay } from "@/utils/date";
import { useTheme } from "@/theme/ThemeProvider";
import { DailyMealTotal, Meal } from "@/types/types";
import { useFocusEffect } from "expo-router";
import { StatusBar } from 'expo-status-bar';
import { useCallback, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function HomeScreen() { 
  const { colors } = useTheme();

  const [ meals, setMeals ] = useState<Meal[]>( [] );
  const [ weeklyTotals, setWeeklyTotals ] = useState<DailyMealTotal[]>( [] );
  const [ profileName, setProfileName ] = useState( 'NutriTrack User' );
  const [ selectedDate, setSelectedDate ] = useState( startOfDay( new Date() ) );
  
  const loadMeals = useCallback( async () => {
    const [data, trends] = await Promise.all([
      getMealsForDate( selectedDate ),
      getDailyMealTotals(),
    ]);
    setMeals( data );
    setWeeklyTotals( trends );
  }, [selectedDate] );

  const handleDateChange = useCallback( (date: Date) => {
    setSelectedDate( startOfDay( date ) );
  }, [] );

  useFocusEffect(
    useCallback( () => {
      loadMeals();
      getUserProfile().then( (profile) => setProfileName( profile.name ) );
    }, [loadMeals] ),
  );

  const handleMealDeleted = useCallback( () => {
    loadMeals();
  }, [loadMeals] );

  return (
    <SafeAreaProvider >
        <ScrollView 
            style={[globalStyles.container, { backgroundColor: colors.background }]}
            contentContainerStyle={{ paddingBottom: 120 }}
        >
        <View style={globalStyles.header}>
          <View style={styles.brand}>
            <Text style={[globalStyles.title, { color: colors.text }]}>NutriTrack</Text>
            <ProfileAvatar profile={{ name: profileName, email: '' }} size={34} />
          </View>
          <ShareButton meals={meals} />
        </View>
        
        <StatusBar style={colors.background === '#f4f7fb' ? 'dark' : 'light'} />
        <HomeHeader selectedDate={selectedDate} onDateChange={handleDateChange} />
        <MacroGrid meals={meals} />
        <CopyButton meals={meals} />
        <ReminderToggle />
        <RecentMeals meals={ meals } onDelete={handleMealDeleted}/>
        <WeeklyTrends totals={weeklyTotals} />
      </ScrollView>
      
    </SafeAreaProvider>
  )
};

const styles = {
  brand: {
    alignItems: 'center' as const,
    flexDirection: 'row' as const,
    gap: 10,
  },
};
