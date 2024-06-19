import { Text, View } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import MapView, { Marker } from "react-native-maps";

export default function GoogleMapsScreen(){
 return (
<View>
{console.log("aaaaaaaaaaa")}
          <View className="top-20">
          <GooglePlacesAutocomplete
      placeholder='Search'
      onPress={(data, details = null) => {
        console.log(data, details);
      }}
      query={{
        key: 'AIzaSyBz4Mw1dWozbThQRIK-cpCI22_Omt8_ghc',
        language: 'vi',
      }}
      onFail={error => console.log(error)}
    />
          </View>
    
    <View style={{flex:0.9}} > 
    <MapView initialRegion={{
    latitude: 10.728039904811334, 
    longitude: 106.7313410489473,
    latitudeDelta: 0.01,
    longitudeDelta:0.01
}} 
    mapType="standard">
    <Marker
        title="dddd"
        coordinate={{
        latitude: 10.728039904811334, longitude: 106.7313410489473,
    }}/>
    {/* <Image source={require("../assets/icons/placeholder.png")}  style={{height:35, width:35}}/> */}

    
</MapView>
    </View>


</View>
 )
}