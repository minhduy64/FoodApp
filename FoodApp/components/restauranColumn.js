import { Image, Text, TouchableWithoutFeedback, View } from "react-native";
import * as Icon from "react-native-feather";
import { themeColors } from "../theme";
import { useNavigation } from "@react-navigation/native";
import truncateString from "../utils";

export default function RestaurantColumn({store}) {
    const navigation = useNavigation();
    const item = store;  

    return (
        <TouchableWithoutFeedback onPress={() => navigation.navigate("Restaurant", {item: item})}>
            <View style={{ shadowColor: themeColors.bgColor(0.2), shadowRadius: 7 }} className="flex-row mr-6 bg-white ">
                <Image className="h-25 w-28 rounded-xl m-2" source={{ uri: item.image }} />
                <View className="px-3 pb-4 space-y-2">
                    <Text className="text-lg font-bold pt-2">{item.name}</Text>
                    <View className="flex-row items-center space-x-1">
                        <Image source={require('../assets/images/star.png')} className="h-5 w-5" />
                        <Text>
                            <Text className="text-green-700">5</Text>
                            <Text className="text-gray-700">
                                | 4.4k reviews - <Text className="font-semibold">{item.category_name}</Text>
                            </Text>
                        </Text>
                    </View>
                    <View className="flex-row items-center space-x-1">
                        <Icon.MapPin color="gray" width="15" height="15" />
                        <Text className="text-gray-700 text-xs">Nearby - {truncateString(item.location, 25)}</Text>
                    </View>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
}
