import { View, Text, Image, useWindowDimensions, TouchableOpacity } from "react-native";

import DishCard from "./dishCard";


export default function DishType({ items, onUpdateQuantity }) {
    const { width: contentWidth } = useWindowDimensions();
    const uniqueTypes = [...new Set(items.menuItems.map(item => item.type))];

    const itemsByType = {};

    uniqueTypes.forEach(type => {
        itemsByType[type] = items.menuItems.filter(item => item.type === type);
    });

    return (
        <View className='flex-row justify-between items-center px-4'>
            {uniqueTypes.map((type, index)=>{
                return (
                    <View key={index} className="h-full w-full">
                        <Text key={index} className="font-bold text-lg ml-5 pb-5">{type}</Text>
                            {itemsByType[type].map((item, index)=> 
                            <DishCard key={index} item= {item} onUpdateQuantity={onUpdateQuantity} />)}
                    </View>
                )
            })}
        </View>
        
    )
}