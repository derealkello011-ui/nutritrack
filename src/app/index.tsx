import HomeHeader from "@/components/HomeHeader";
import { globalStyles } from "@/styles/global";
import { Link } from "expo-router";
import { ScrollView, StatusBar, Text } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function HomeScreen() { 
  return (
    <SafeAreaProvider>
        <ScrollView style={globalStyles.container}>
          <Text style={globalStyles.title}>NutriTrack</Text>
        <HomeHeader />
        <Link href={'/meals'} style={{
          fontSize: 18,
          color: '#007bff',
        }} >
          Go to Meals
        </Link>
        </ScrollView>
      <StatusBar />
    </SafeAreaProvider>
  )
};
