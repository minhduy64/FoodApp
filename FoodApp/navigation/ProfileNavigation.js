import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ChangePassScreen from "../screens/App/ChangePassScreen";
import AccountScreen from "../screens/App/AccountScreen";

const Stack = createNativeStackNavigator();

export default function ProfileNavigation() {
    return (
            <Stack.Navigator initialRouteName="Account" >
                <Stack.Screen name="Account" options={{presentation: "modal", headerShown: false}} component={AccountScreen}/>
                <Stack.Screen name="ChangePass" options={{presentation: "modal", headerShown: false}} component={ChangePassScreen}/>
            </Stack.Navigator>
    )
}