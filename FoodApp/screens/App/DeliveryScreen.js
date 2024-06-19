import { useNavigation } from "@react-navigation/native";
import { Image, View } from "react-native";
import MapView, {Marker} from "react-native-maps";

export default function DeliveryScreen({route}) {

    const store = route.params.store;
    const navigation = useNavigation();
    console.log(store.name)
    return (
        <View className="flex-1">

            <MapView initialRegion={{
                latitude: store.longitude, longitude: store.latitude, 
                latitudeDelta: 0.01,
                longitudeDelta:0.01
            }} 
                className="flex-1" 
                mapType="standard">
                <Marker
                    title={store.name}
                    coordinate={{
                    latitude: store.longitude, longitude: store.latitude,
                }}/>
                {/* <Image source={require("../assets/icons/placeholder.png")}  style={{height:35, width:35}}/> */}

                
            </MapView>

        </View>
    )
}