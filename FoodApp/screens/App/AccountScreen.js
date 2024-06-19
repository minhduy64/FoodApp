import { useContext, useState } from "react";
import {TouchableOpacity, Image, ScrollView, Text, View, TextInput, Alert } from "react-native";
import { Button} from "react-native-paper";
import * as ImagePicker from 'expo-image-picker';
import * as Icon from "react-native-feather"
import { themeColors } from "../../theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { userActions } from "../../configs/redux/reducers/InfoReducer";
import { UserApi } from "../../configs/APis/UserApi";

export default AccountScreen = () => {

    const user = useSelector((state) => state.personalInfor);
    const [first_name, setFirst_name] = useState({first_name:user.first_name})
    const [last_name, setLast_name] = useState({last_name:user.last_name})
    const [email, setEmail] = useState({email:user.email})
    

    const navigation = useNavigation()
    const [avatar, setAvartar] = useState();
    const dispatch = useDispatch();
    
    const picker = async () => {
        const token = await AsyncStorage.getItem('token');
        
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted')
            Alert.alert("iCourseApp", "Permissions Denied!");
        else {
            let res = await ImagePicker.launchImageLibraryAsync();
            if (!res.canceled) {
                setAvartar(res.assets[0]);
                const formData = new FormData();
                formData.append('id', '1'); //TODO
                formData.append('avatar', {
                    uri: res.assets[0].uri,
                    name: res.assets[0].fileName,
                    type: res.assets[0].type,
                });
                try {
                    await UserApi.uploadAvatar(user.id, formData, token)
                        .then(function (response) {
                            Alert.alert('Upload avatar successfully')
                        })
                        .catch(function (response) {
                            Alert.alert('Upload avatar failed')
                        });;
        
                } catch (error) {
                    Alert.alert("Error updating information")
                }
            }
        }
   
    }

    const onChangeInfoPressed = async () => {
        const token = await AsyncStorage.getItem('token');
        const formData = new FormData();
        formData.append('avatar', user.avatar);
        formData.append('first_name', first_name["first_name"]);
        formData.append('last_name', last_name["last_name"]);
        formData.append('email', email["email"]);



        console.log(formData)

        try {
            await UserApi.updateInfor(user.id,formData,token)
            .then(function (response) {
                Alert.alert('Upload Infor successfully')
            })
            .catch(function (response) {
                Alert.alert('Upload Infor failed')
            })
        } catch(error){
            Alert.alert("Error updating information")
        }

    }

    const onChangePassPressed = () => {
            navigation.navigate("ChangePass")
    }

    const onLogoutPressed = async () => {
        dispatch(userActions.logout())
    }

    return (
        <ScrollView>
            <View className="flex flex-start items-center pt-20">
                <View className="flex-1 justify-center items-center">
                {avatar?<Image className="rounded-full" source={{uri: avatar.uri}} style={{width:130, height:130}} />:<Image className="rounded-full" style={{height:130, width:130}} source={{uri:user.avatar}}/>}
                    
                    <Button className="absolute bottom-7 left-24 "
                        icon={() => (
                            <Icon.Edit2  height="20" width="20" stroke={themeColors.text}/>
                        )}
                        onPress={picker}/>
                    
                    <Text className="mt-5 font-bold text-xl">{user.username}</Text>
                </View>
            </View>
            <View className="flex flex-start  pl-5 pr-5">
                <Text className="font-bold text-xl pt-10 pb-10">Thông tin</Text>
                
                 <View className="h-14 flex-row justify-between items-center px-5 border-t-2 border-gray-200">
                    <Text>Password: </Text>
                    <TextInput editable={false} secureTextEntry className="w-3/5 font-bold" value={"12345678"}/>
                    <Button
                        icon={() => (
                            <Icon.Edit2  height="20" width="20" stroke={themeColors.text}/>
                        )}
                        onPress={onChangePassPressed}/>
                 </View>
                 <View className="h-14 flex-row items-center px-5 border-t-2 border-gray-200">
                    <Text>Email: </Text>
                    <TextInput className="left-1 w-3/5 font-bold" value={email["email"]} onChangeText={t => setEmail({email:t})}/>

                 </View>
                 <View className="h-14 flex-row items-center px-5 border-t-2 border-gray-200">
                    <Text>First Name: </Text>
                    <TextInput className="w-3/5 font-bold" value={first_name["first_name"]} onChangeText={t => setFirst_name({first_name:t})}/>
                 </View>
                 <View className="h-14 flex-row items-center px-5 border-t-2 border-gray-200">
                    <Text>Last Name: </Text>
                    <TextInput className="w-3/5 font-bold" value={last_name["last_name"]} onChangeText={t => setLast_name({last_name:t})}/>
                 </View>

                 <TouchableOpacity onPress={onChangeInfoPressed} className="top-5 bottom-5 h-10 w-20 rounded-full justify-center" style={{backgroundColor:themeColors.text}}><Text className="text-center text-white"  >Change</Text></TouchableOpacity>
          
                 <Text className="font-bold text-xl pt-10 pb-10">Cữa Hàng</Text>

                 <TouchableOpacity onPress={onLogoutPressed} className="py-3 bg-yellow-400 rounded-xl">
                        <Text className="font-xl font-blod text-center text-gray-700">LogOut</Text>
                </TouchableOpacity>

            </View>
        </ScrollView>
    )
};


