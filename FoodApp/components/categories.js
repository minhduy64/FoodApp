import { Image, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";

export default function Categories({props, onCategoriesPressed}) {
    const [activeCategory, setActiveCatergory] = useState(null);


    let isActive = props.id == activeCategory;
    let btnClass = isActive? 'bg-gray-600':'bg-gray-200';
    let textClass = isActive? 'font-semibold text-gray-800' : 'text-gray-500'
    return (
        <View className="flex justify-center items-center mr-6">
            <TouchableOpacity onPress={()=>onCategoriesPressed(props.id)} className={"p-5 rounded-full shadow bg-gray-200"}>
                <Image style={{width:45, height:45}} source={{uri: props.icon}} />
            </TouchableOpacity>
            <Text className={"text-sm" +textClass}>{props.name}</Text>
        </View>
    )
}