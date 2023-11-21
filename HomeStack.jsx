import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./src/screens/home";
import AddNewExpense from "./src/screens/addNewExpenseScreen";
// import Screen2 from './Screen2';

const Stack = createStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Home2" component={HomeScreen} />
      <Stack.Screen name="addNewExpenseScreen" component={AddNewExpense} />
    </Stack.Navigator>
  );
};

export default HomeStack;
