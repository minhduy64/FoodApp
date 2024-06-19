import { SafeAreaView,TouchableOpacity, ScrollView, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import * as Icon from "react-native-feather"
import { TextInput } from "react-native-paper";
import { themeColors } from "../../theme";
import Categories from "../../components/categories";
import API, { endpoints } from "../../configs/APis/API";
import { featured } from "../../constants";
import FeatureRow from "../../components/featureRow";
import * as Location from 'expo-location'
import truncateString from "../../utils";
import RestaurantColumn from "../../components/restauranColumn";
import { CategoriesApi } from "../../configs/APis/CategoriesApi";
import { SearchApi } from "../../configs/APis/SearchApi";


export default function HomeScreen() {
    const [categories, setCategories] = useState([]);
    const [currentLocation, setCurrentLocation] = useState();
    const [address, setAddress] = useState("");
    const [stores, setStores] = useState([]);
    const [query, setQuery] = useState('');

    const loadStores = async () => {stores
        try {
            let res = await API.get(endpoints['stores'])
            setStores(res.data.results)
        } catch (ex) {
            console.error(ex)
        }
    }

    const getPermissions = async () => {
        let {status} = await Location.requestForegroundPermissionsAsync();
        if(status !== 'granted')
            {
                console.log("please grant location permissions")
                return;
            }

            let currentLocation = await Location.getCurrentPositionAsync({});
            setCurrentLocation(currentLocation);
            console.log(currentLocation);
            reverseGeocode();
    };

    const reverseGeocode = async () => {
        const reverseGeocodeAddress = await Location.reverseGeocodeAsync({
            latitude: currentLocation.coords.latitude,
            longitude: currentLocation.coords.longitude
        });

        setAddress(reverseGeocodeAddress[0].name+", "+reverseGeocodeAddress[0].district+", "+reverseGeocodeAddress[0].subregion+", "+reverseGeocodeAddress[0].region)
    }

    const loadCategories = async () => {
        try {
            let res = await API.get(endpoints['categories'])
            setCategories(res.data)
        } catch (ex) {
            console.error(ex)
        }
    }
    const onCategoriesPressed = async (id) => {

        const res = await CategoriesApi.getStores(id)
        setStores(res.data)
        console.log(res.data)
    }

    const searchStores = async () => {
        try {
          const res = await SearchApi.getStores(query)
          setStores(res.data);
        } catch (error) {
          console.error(error);
        }
      };
    
    useEffect(() => {
        loadCategories();
        loadStores();
        getPermissions();
    },[])

    return (
        <SafeAreaView className="bg-white">
            <StatusBar barStyle="dark-content"/>

            <View className="flex-row items-center space-x-2 py-12 px-4 pb-2">
                <View className="flex-row flex-1 items-center p-1 rounded-full border border-gray-300">
                        <Icon.Search height="20" width="20" stroke="gray" />
                        <TextInput value={query} onChangeText={setQuery} onSubmitEditing={searchStores} placeholder="Enter Key Search..." className="ml-2 flex-1 h-8"/>
                        <TouchableOpacity className="flex-row items-center space-x-1 border-0 border-l-2 pl-2 border-l-gray-300">
                             <Icon.MapPin height="20" width="20" stroke="gray" />
                             <Text className="text-gray-600">{truncateString(address,5)}</Text>
                        </TouchableOpacity>
                </View>
                <View style={{backgroundColor: themeColors.bgColor(1)}} className="p-3 bg-gray-300 rounded-full">
                       <Icon.Sliders height="20" width="20" strokeWidth={2.5} stroke="white" />
                </View>

            </View>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom: 20}}> 
                <View className="mt-4">
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="overflow-visible" contentContainerStyle={{paddingHorizontal: 15}}>
                        {categories.map(c => (
                            <Categories onCategoriesPressed={onCategoriesPressed} key={c.id} props={c} />
                        ))}
                    </ScrollView>
                </View>
                <View className="mt-5">
                    {
                        [featured].map((item,index)=>{
                            return (
                                <FeatureRow key={index} title={item.title} description={item.description} />
                            )
                        })
                    }

                </View>
                <ScrollView className="mt-5">
                    {stores!=undefined?stores.map((item, index) => {
                            return (
                                <RestaurantColumn key={index} store={item}/>
                            )
                        }):<></>
                    }
                </ScrollView>
            </ScrollView>
        </SafeAreaView>
    )
}