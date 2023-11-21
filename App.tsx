import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text, Image, View, StyleSheet } from "react-native";

import HomeStack from "./HomeStack";
import BudgetStack from "./BudgetStack";

import BudgetScreen from "./src/screens/budget";
import HomeScreen from "./src/screens/home";
import ExpenseScreen from "./src/screens/expense";
import StatsScreen from "./src/screens/stats";

import { initializeCategories, deleteData } from "./storage/database";
const Tab = createBottomTabNavigator();

const CustomTabIcon = ({ type, focused, size, tintColor }) => {
  const iconImages = {
    home: focused ? require(`./assets/bottomTab/home-active.png`) : require(`./assets/bottomTab/home-inactive.png`),
    expense: require(`./assets/bottomTab/expenses-inactive.png`),
    budget: require(`./assets/bottomTab/budget-inactive.png`),
    stats: require(`./assets/bottomTab/home-active.png`),
  };

  return <Image source={iconImages[type]} style={{ width: size, height: size, tintColor }} />;
};

const App = () => {
  // return (
  //   <NavigationContainer>
  //     <AppNavigator />
  //   </NavigationContainer>
  // );

  initializeCategories().catch((err) => console.error("#########", err));
  // deleteData("selectedCategories").catch((err) => console.error(err));
  // deleteData("allCategories").catch((err) => console.error(err));
  // deleteData("11/2023").catch((err) => console.error(err));

  return (
    <NavigationContainer>
      {/* home tab */}
      <Tab.Navigator>
        <Tab.Screen
          name="Home"
          component={HomeStack}
          options={{
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <CustomTabIcon type={"home"} focused={true} size={size} tintColor={color} />
            ),
          }}
        />

        {/* budget tab */}
        <Tab.Screen
          name="Budget"
          component={BudgetStack}
          options={{
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <CustomTabIcon type={"budget"} focused={true} tintColor={color} size={size} />
            ),
          }}
        />

        {/* expense tab */}
        <Tab.Screen
          name="Expense"
          component={ExpenseScreen}
          options={{
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <CustomTabIcon type={"expense"} focused={true} tintColor={color} size={size} />
            ),
          }}
        />
        <Tab.Screen name="Stats" component={StatsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;
