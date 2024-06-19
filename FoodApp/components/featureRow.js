import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { themeColors } from "../theme";
import API, { endpoints } from "../configs/APis/API";
import RestaurantCard from "./restaurantCard";
import { MyUserContext } from "../configs/Contexts";
import RestaurantColumn from "./restauranColumn";

export default function FeatureRow({title, description}) {
    
    const [stores, setStores] = useState([]);


    const loadStores = async () => {
        try {
            let res = await API.get(endpoints['stores'])
            setStores(res.data.results)
        } catch (ex) {
            console.error(ex)
        }
    }
    
    useEffect(() => {
        loadStores();
    },[])


    return (
        <View>
            <View className="flex-row justify-between items-center px-4">
                <View>
                    <Text className="font-bold text-lg">{title}</Text>
                    <Text className="text-gray-500 text-xs">{description}</Text>
                </View>
                <TouchableOpacity>
                <Text className="font-semibold" style={{color: themeColors.text}}>See All</Text>
                </TouchableOpacity>
            </View>
            <ScrollView className="overflow-visible py-5" horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{paddingHorizontal: 15}}>
                {
                    stores.map((store, index) => {
                        return(
                                  <RestaurantCard key={index} store={{store}}/>
                        )
                    })


                }
            </ScrollView>
            
        </View>
    )
}