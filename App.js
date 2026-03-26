import React from "react";
import { View, Text as RNText } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider, useTheme } from "./utils/ThemeContext";

import HomeScreen from "./screens/HomeScreen";
import QuizScreen from "./screens/QuizScreen";
import ResultScreen from "./screens/ResultScreen";
import ReviewScreen from "./screens/ReviewScreen";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const IconText = ({ children, color }) => (
  <RNText style={{ fontSize: 20, color }}>{children}</RNText>
);

const MainTabs = () => {
  const { theme } = useTheme();
  
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.background,
          borderTopColor: theme.divider,
          height: 65,
          paddingBottom: 10,
          paddingTop: 10,
        },
        tabBarActiveTintColor: theme.accent,
        tabBarInactiveTintColor: theme.dimmedText,
        tabBarLabelStyle: {
          fontWeight: "800",
          fontSize: 12,
        },
      }}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={HomeScreen} 
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color }) => <IconText color={color}>🏠</IconText>
        }}
      />
      <Tab.Screen 
        name="Stats" 
        component={ResultScreen} 
        initialParams={{ score: null, total: null }}
        options={{
          tabBarLabel: "Results",
          tabBarIcon: ({ color }) => <IconText color={color}>📊</IconText>
        }}
      />
    </Tab.Navigator>
  );
};

const App = () => {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Main" component={MainTabs} />
            
            <Stack.Screen name="Quiz" component={QuizScreen} />
            
            <Stack.Screen name="ResultSummary" component={ResultScreen} />

            <Stack.Screen name="Review" component={ReviewScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </ThemeProvider>
    </SafeAreaProvider>
  );
};

export default App;
