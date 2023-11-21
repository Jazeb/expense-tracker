import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./src/screens/home";
import StatsScreen from "./src/screens/stats";
import BudgetScreen from "./src/screens/budget";
import SelectCategoryScreen from "./src/screens/selectCategoryScreen";
import AddNewBudgetScreen from "./src/screens/addNewBudgetScreen";
// import Screen2 from './Screen2';

const Stack = createStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="BudgetScreen2" component={BudgetScreen} />
      <Stack.Screen name="SelectCategoryScreen" component={SelectCategoryScreen} />
      <Stack.Screen name="AddNewBudgetScreen" component={AddNewBudgetScreen} />
    </Stack.Navigator>
  );
};

export default HomeStack;
