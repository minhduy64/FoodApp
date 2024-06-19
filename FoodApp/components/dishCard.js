import { View, Text, Image, useWindowDimensions, TouchableOpacity } from "react-native";
import RenderHTML from "react-native-render-html";
import { themeColors } from "../theme";
import * as Icon from "react-native-feather";
import { useState } from "react";

export default function DishCard({item, onUpdateQuantity }) {
    const { width: contentWidth } = useWindowDimensions();
    const [quantity, setQuantity] = useState(0);

    const handleIncrease = () => {
        setQuantity(quantity + 1);
        onUpdateQuantity(item.id, quantity + 1);
    };

    const handleDecrease = () => {
        if (quantity >= 1) {
            setQuantity(quantity - 1);
            onUpdateQuantity(item.id, quantity - 1);
        }
    };

    return (
           <View className='flex-row items-center bg-white p-3 rounded-3xl shadow-2xl mb-3 mx-2'>
                <Image className="rounded-3xl" style={{height:100, width:100}} source={{uri: item.image}}/>
                <View className="flex flex-1 space-y-3">
                    <View className="pl-3">
                        <Text className="text-xl">{item.name}</Text>
                        <RenderHTML className="text-gray-700" contentWidth={contentWidth} source={{ html: item.content }}/>
                    </View>
                    <View className="flex-row justify-between pl-3 items-center">
                        <Text className="text-gray-700 text-lg font-bold">
                            ${item.price}
                        </Text>
                        <View className="flex-row items-center space-x-2"> 
                            <TouchableOpacity onPress={handleDecrease} className="p-1 rounded-full" style={{backgroundColor: themeColors.bgColor(1)}}>
                                <Icon.Minus strokeWidth={2} height={20} width={20} stroke={"white"} />
                            </TouchableOpacity>
                            <Text className="px-3 font-bold">{quantity}</Text>
                            <TouchableOpacity onPress={handleIncrease} className="p-1 rounded-full" style={{backgroundColor: themeColors.bgColor(1)}}>
                                <Icon.Plus strokeWidth={2} height={20} width={20} stroke={"white"} />
                            </TouchableOpacity>

                        </View>
                    
                    </View>

                </View>
           </View>
    )
}