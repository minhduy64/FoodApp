import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/App/HomeScreen";
import CartScreen from "../screens/App/CartScreen";
import DeliveryScreen from "../screens/App/DeliveryScreen";
import RestaurantScreen from "../screens/App/RestaurantScreen";
import OrderPrepairingScreen from "../screens/App/OrderPrepairingScreen";
import ChangePassScreen from "../screens/App/ChangePassScreen";
import PayScreen from "../screens/App/PayScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigation() {
    return (
            <Stack.Navigator initialRouteName="Home" >
                <Stack.Screen name="Home" options={{headerShown: false}} component={HomeScreen}/>
                <Stack.Screen name="Cart" options={{headerShown: false}} component={CartScreen}/>
                <Stack.Screen name="Restaurant" options={{headerShown: false}} component={RestaurantScreen}/>
                <Stack.Screen name="Delivery" options={{headerShown: false}} component={DeliveryScreen}/>
                <Stack.Screen name="OrserPrepair" options={{headerShown: false}} component={OrderPrepairingScreen}/>
                <Stack.Screen name="ChangePass" options={{presentation: "modal", headerShown: false}} component={ChangePassScreen}/>
                <Stack.Screen name="Payment" options={{headerShown: false}} component={PaymentWebView}/>

            </Stack.Navigator>
    )
}