import { useNavigation } from "@react-navigation/native";
import { useEffect } from "react";
import { Image, View } from "react-native";

export default function OrderPrepairingScreen({route}) {
    const store = route.params.store;

    const navigation = useNavigation();
    useEffect(() => {
        setTimeout(()=> {
        navigation.navigate("Delivery",{store})
        },3000)
    },[])

    return (
        <View className="flex-1 bg-white justify-center items-center">
            <Image source={require("../../assets/images/login.png")} className="h-80 w-80"/>
        </View>
    )
}