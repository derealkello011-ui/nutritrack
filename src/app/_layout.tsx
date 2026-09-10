import { Stack } from "expo-router";

export default function RootLayout() {
  return <Stack
    screenOptions={{
      headerShown: false,
      // headerStyle: {
      //   backgroundColor: colors.header
      // },
      // headerTintColor: "#ffffff"
    }}>
    <Stack.Screen
      name="index"
      options={{
        headerShown: false,
        title: 'Home'
      }}
    />
    <Stack.Screen name="meals"
      options={{
        title: 'Meals',
        headerShown: true
      }}
    />
    <Stack.Screen
      options={{
        title: 'Add Meal',
        headerShown: true }}
      name="add-meal"
    />
    </Stack>
    ;
}
