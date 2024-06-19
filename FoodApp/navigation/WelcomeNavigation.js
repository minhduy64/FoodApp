import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import WelcomeScreen from "../screens/Account/WelcomeScreen";
import LoginScreen from "../screens/Account/LoginScreen";
import SignUpScreen from "../screens/Account/SignUpScreen";

const Stack = createNativeStackNavigator();

export default function WelcomeNavigation() {
    return (
            <Stack.Navigator initialRouteName="Welcome" >
                <Stack.Screen name="Welcome" options={{headerShown: false}} component={WelcomeScreen}/>
                <Stack.Screen name="Login" options={{headerShown: false}} component={LoginScreen}/>
                <Stack.Screen name="SignUp" options={{headerShown: false}} component={SignUpScreen}/>
            </Stack.Navigator>
    )
}