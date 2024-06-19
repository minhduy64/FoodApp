import { Alert, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import * as Icon from "react-native-feather";
import { themeColors } from "../../theme";
import { useNavigation } from "@react-navigation/native";
import { useContext, useEffect, useState } from "react";
import { delivery, paypalMethods } from "../../constants";
import { OrdersApi } from "../../configs/APis/OrsersApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserApi } from "../../configs/APis/UserApi";
import { PayApis } from "../../configs/APis/PayApi";


export default function CartScreen({route}) {
    const store = route.params.store
    const cart = route.params.cart
    const [deliveryFee, setDeliveryFee] = useState(5);
   
    const navigation = useNavigation();
    const [selectedOption, setSelectedOption] = useState(1);
    const [selectedOptionPaypal, setSelectedOptionPaypal] = useState(1);
    const [menu_items, setMenu_items] = useState([])
    const [data, setData] = useState({})
    const [resData,setResData] = useState()
    const loadData = async () => {
        try {
        const token = await AsyncStorage.getItem('token')

        const res = await UserApi.getUser(token);

        setData( {
            user:res.data.id,
            store:store.id,
            menu_items:menu_items,
            total_price:String(cart.totalPrice),
            delivery_fee:String(deliveryFee),
            payment_method:selectedOptionPaypal===1?"Cash":"momo",
            status:"pending"
        })
        }catch(error){
            console.log("Error")
        }
        
    }

    useEffect(() => {
        cart.items && Object.values(cart.items).map((item)=>{
            setMenu_items(current => {
                return [...current, {menu_item:item.id,quantity:item.quantity}]
            });
        })
        loadData();
        
    },[selectedOption,selectedOptionPaypal])

    

    const onPlayOrderPressed = async () => {
        try {
               const res = await OrdersApi.createOrders(data)
        if(selectedOptionPaypal==2){
            const params = {
                order_id: res.data.id,
                amount: cart.totalPrice+deliveryFee
            }
            const resPay = await PayApis.PaymentOrders(params)
            
            console.log(resPay.data)

            navigation.navigate("Payment",payUrl=resPay.data)
        }else
        {
           navigation.navigate("Home")
           Alert.alert("Order placed successfully.")
        }

        } catch(error){
            Alert.alert("Error Payment")
        }

       


    }


    const handleDeliveryFee = (id) => {
              setSelectedOption(id)
              setDeliveryFee(5*id)
    }
    const handlePaypal = (id) => {
        setSelectedOptionPaypal(id)
}
   
    return (
        <View className="bg-white flex-1 top-5">
            <View className="relative py-4 shadow-sm">
                <TouchableOpacity onPress={() => navigation.goBack()} className="absolute z-10 top-10 left-2 bg-gray-700 p-2 rounded-full shadow">
                    <Icon.ArrowLeft strokeWidth={3} stroke={themeColors.bgColor(1)} />
                </TouchableOpacity>
                <View>
                <Text className="text-center font-bold text-xl">Your Cart</Text>
                <Text className="text-center text-gray-500">{store.name}</Text>
            </View>
            </View>
           
            <View className="mb-10">
                <Text className="font-bold top-5 left-2">Delivery options</Text>
            </View>
            <View>
            {delivery.map((option) => (
                    <TouchableOpacity className="flex-row my-0.5 items-center px-5 h-12 w-full border rounded-t-[10] rounded-b-[10]" style={[{borderColor: "#e3e3e3"},selectedOption === option.id &&  {borderColor:themeColors.text}]}
                        key={option.id}
                        onPress={() => handleDeliveryFee(option.id)}>
                        <Text className="font-bold text-3xs">
                            {option.name}
                        </Text>
                    </TouchableOpacity>
                    
                ))}
            </View>
            <ScrollView className="bg-white pt-5" showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom: 50}}>
                {
                    cart.items && Object.values(cart.items).map((dish, index)=> {
                        return (
                            <View key={index} className="flex-row items-center space-x-3 py-2 px-4 bg-white rounded-3xl mx-2 mb-3 shadow-md">
                                <Text className="font-bold" style={{color: themeColors.text}}>
                                       {dish.quantity} x
                                </Text>
                                <Image className="h-14 w-14 rounded-full" source={{uri: dish.image}}/>
                                <Text className="flex-1 font-bold">{dish.name}</Text>
                                <Text className="font-semibold text-base">${dish.price}</Text>
                            </View>
                        )
                    })
                }
            </ScrollView>
            <View className="bg-gray-100 shadow-md h-25 rounded-3xl">
                <Text className="font-bold">Payment methods:</Text>
                {paypalMethods.map((option) => (
                    <TouchableOpacity className="bg-white flex-row my-0.5 items-center px-5 h-12 w-full border rounded-t-[10] rounded-b-[10]" style={[{borderColor: "#e3e3e3"},selectedOptionPaypal === option.id &&  {borderColor:themeColors.text}]}
                        key={option.id}
                        onPress={() => handlePaypal(option.id)}>
                        <Text className="font-bold text-3xs">
                            {option.name}
                        </Text>
                    </TouchableOpacity>
                    
                ))}
            </View>
            <View style={{backgroundColor: themeColors.bgColor(0.2)}} className="p-6 px-8 rounded-t-3xl space-y-4">
                <View className="flex-row justify-between">
                    <Text className="text-gray-700">Subtotal</Text>
                    <Text className="text-gray-700">${cart.totalPrice}</Text>
                </View>
                <View className="flex-row justify-between">
                    <Text className="text-gray-700">Delivery Fee</Text>
                    <Text className="text-gray-700">${deliveryFee}</Text>
                </View>
                <View className="flex-row justify-between">
                    <Text className="text-gray-700">Order Total</Text>
                    <Text className="text-gray-700">${cart.totalPrice+deliveryFee}</Text>
                </View>
                <View>
                    <TouchableOpacity onPress={onPlayOrderPressed} className="p-3 rounded-full" style={{backgroundColor:themeColors.bgColor(1)}}>
                        <Text className="text-white text-center font-blod text-lg">Place Order</Text>
                    </TouchableOpacity>
                </View>

            </View>

            
       
          
        </View>
    )
}