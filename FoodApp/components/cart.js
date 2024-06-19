import { Text, TouchableOpacity, View } from "react-native";
import { themeColors } from "../theme";
import { useNavigation } from "@react-navigation/native";

export default function Cart({ store, cart }) {
    
    const navigation = useNavigation();

    return (
        <View className="absolute bottom-5 w-full z-50">
            <TouchableOpacity onPress={() => navigation.navigate("Cart", {store, cart})} style={{backgroundColor: themeColors.bgColor(1)}} className="flex-row justify-between items-center mx-5 rounded-full p-4 py-3 shadow-lg">
                <View className="p-2 px-4 rounded-full" style={{backgroundColor: 'rgba(255,255,255,0.3)'}}>
                    <Text className="font-extrabold text-white text-lg">
                       {cart.totalQuantity}
                    </Text>
                </View>
                <Text className="flex-1 text-center font-extrabold text-white text-lg">
                     View Cart
                </Text>
                <Text className="font-extrabold text-white text-lg">${cart.totalPrice.toFixed(2)}</Text>

            </TouchableOpacity>

        </View>
    )
}