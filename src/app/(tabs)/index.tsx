import HomeHeader from "@/components/HomeHeader";
import MacroGrid from "@/components/MacroGrid";
import { globalStyles } from "@/styles/global";
import { ScrollView, Text } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function HomeScreen() { 
  return (
    <SafeAreaProvider>
        <ScrollView style={globalStyles.container}>
          <Text style={globalStyles.title}>NutriTrack</Text>
        <HomeHeader />
        <MacroGrid />
        </ScrollView>
    </SafeAreaProvider>
  )
};
