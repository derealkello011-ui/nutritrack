import HomeHeader from "@/components/HomeHeader";
import MacroGrid from "@/components/MacroGrid";
import RecentMeals from "@/components/RecentMeals";
import { globalStyles } from "@/styles/global";
import { StatusBar } from 'expo-status-bar';
import { ScrollView, Text } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function HomeScreen() { 
  return (
    <SafeAreaProvider >
        <ScrollView 
            style={globalStyles.container} 
            contentContainerStyle={{ paddingBottom: 120 }}
        >
        <Text style={globalStyles.title}>NutriTrack</Text>
        <StatusBar style="light"/>
        <HomeHeader />
        <MacroGrid />
        <RecentMeals />
      </ScrollView>
      
    </SafeAreaProvider>
  )
};
