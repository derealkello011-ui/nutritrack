import CopyButton from "@/components/CopyButton";
import HomeHeader from "@/components/HomeHeader";
import MacroGrid from "@/components/MacroGrid";
import RecentMeals from "@/components/RecentMeals";
import ShareButton from "@/components/ShareButton";
import { getMeals } from "@/storage/meals";
import { globalStyles } from "@/styles/global";
import { Meal } from "@/types/types";
import { useFocusEffect } from "expo-router";
import { StatusBar } from 'expo-status-bar';
import { useCallback, useState } from "react";
import { Alert, ScrollView, Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function HomeScreen() { 

  const [ meals, setMeals ] = useState<Meal[]>( [] );
  
  const loadMeals = async () => {
    const data = await getMeals();
    setMeals( data );
    Alert.alert( 'Success', `Loaded Meals ${ data }` );
  };

  useFocusEffect(
    useCallback( () => {
      loadMeals();
    }, [] ),
  );

  return (
    <SafeAreaProvider >
        <ScrollView 
            style={globalStyles.container} 
            contentContainerStyle={{ paddingBottom: 120 }}
        >
        <View style={globalStyles.header}>
          <Text style={globalStyles.title}>NutriTrack</Text>
          <ShareButton meals={meals} />
        </View>
        
        <StatusBar style="light" />
        <HomeHeader />
        <MacroGrid meals={meals} />
        <CopyButton meals={meals} />
        <RecentMeals meals={ meals } onDelete={loadMeals}/>
      </ScrollView>
      
    </SafeAreaProvider>
  )
};
