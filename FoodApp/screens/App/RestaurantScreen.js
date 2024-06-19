import { Image, ScrollView, Text, TouchableOpacity, View, useWindowDimensions } from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as Icon from "react-native-feather";
import RenderHTML from "react-native-render-html";
import API, { endpoints } from "../../configs/APis/API";
import DishType from "../../components/dishType";
import truncateString from "../../utils";
import Cart from "../../components/cart";
import { MyUserContext } from "../../configs/Contexts";
import { themeColors } from "../../theme";

export default function RestaurantScreen({ route }) {
    const item = route.params?.item;
    const navigation = useNavigation();
    const { width: contentWidth } = useWindowDimensions();
    const storeId = item.id;
    
    const [cart, setCart] = useState({ items: {},totalPrice: 0, totalQuantity: 0});
    const [menuItems, setMenuItems] = useState([]);

    const loadMenuItems = async () => {
        try {
            let res = await API.get(endpoints['menuStores'](storeId));
            setMenuItems(res.data);
        } catch (ex) {
            console.error(ex)
        }
    }
    
    useEffect(() => {
        loadMenuItems();
    },[])


    const handleUpdateQuantity = (itemId, newQuantity) => {
        const menuItem = menuItems.find(item => item.id === itemId);
        setCart(prevCart => {
            const existingItem = prevCart.items[itemId];
            let updatedItems = {};
    
            if (existingItem) {
                updatedItems = {
                    ...prevCart.items,
                    [itemId]: {
                        ...existingItem,
                        quantity: newQuantity
                    }
                };
            } else {
                updatedItems = {
                    ...prevCart.items,
                    [itemId]: {
                        id: menuItem.id,
                        name: menuItem.name,
                        price: menuItem.price,
                        image: menuItem.image,
                        quantity: newQuantity
                    }
                };
            }
    
            const filteredItems = Object.fromEntries(
                Object.entries(updatedItems).filter(([key, value]) => value.quantity > 0)
            );
    
            const totalPrice = Object.values(filteredItems).reduce(
                (sum, { quantity, price }) => sum + quantity * price,
                0
            );
    
            const totalQuantity = Object.values(filteredItems).reduce(
                (sum, { quantity }) => sum + quantity,
                0
            );
    
            return { items: filteredItems, totalPrice, totalQuantity };
        });
    };

    console.log(cart.items)

    
    return (
        <View>
            {cart.totalQuantity >0?<MyUserContext.Provider value={item}>
                <Cart store={item} cart={cart}/>
            </MyUserContext.Provider>:<></>}
            
            <TouchableOpacity onPress={() => navigation.goBack()} className="absolute top-12 left-5 z-50 bg-gray-700 p-2 rounded-full shadow">
                    <Icon.ArrowLeft strokeWidth={3} stroke={themeColors.bgColor(1)} />
            </TouchableOpacity>
            <ScrollView>
                <View className="relative">
                    <Image className="w-full h-72" source={{ uri: item.image }} />
                </View>
                <View style={{ borderTopLeftRadius: 40, borderTopRightRadius: 40 }} className="bg-white -mt-12 pt-6">
                    <View className="px-5">
                        <Text className="text-3xl font-bold">{item.name}</Text>
                        <View className="flex-row space-x-2 my-1">
                            <View className="flex-row items-center space-x-1">
                                <Image source={require('../../assets/images/star.png')} className="h-5 w-5" />
                                <Text>
                                    <Text className="text-green-700">5</Text>
                                    <Text className="text-gray-700">
                                        | 4.4k reviews - <Text className="font-semibold">{item.category_name}</Text>
                                    </Text>
                                </Text>
                            </View>
                            <View className="flex-row items-center space-x-1">
                                <Icon.MapPin color="gray" width="15" height="15" />
                                <Text className="text-gray-700 text-xs">Nearby - {truncateString(item.location, 12)}</Text>
                            </View>
                        </View>
                        <RenderHTML
                            contentWidth={contentWidth}
                            source={{ html: item.description }}
                        />
                    </View>
                </View>
                <View className="pb-36 bg-white">
                    <Text className="px-4 py-4 text-2xl font-bold">Menu</Text>
                       <DishType items={{menuItems}} onUpdateQuantity={handleUpdateQuantity}/>
                </View>
            </ScrollView>
        </View>
    );
}
