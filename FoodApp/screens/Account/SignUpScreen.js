import { Image , View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from "react-native";
import React, { useState } from "react";
import themeColors from "../../theme/Styles";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeftIcon } from "react-native-heroicons/solid";
import { useNavigation } from "@react-navigation/native";
import { TouchableRipple } from "react-native-paper";
import * as ImagePicker from 'expo-image-picker';
import API, { endpoints } from "../../configs/APis/API";

export default function SignUpScreen() {
    const [user, setUser] = useState({});
    const [err, setErr] = useState(false);
    const [loading, setLoading] = useState(false);

    const navigation = useNavigation();

    const picker = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted')
            Alert.alert("iCourseApp", "Permissions Denied!");
        else {
            let res = await ImagePicker.launchImageLibraryAsync();
            if (!res.canceled) {
                updateSate(res.assets[0], "avatar");
            }
        }
    }

    const updateSate = (value, field) => {
        setUser(current => {
            return {...current, [field]: value}
        });
    }

    const register = async () => {

        if (user.password !== user.confirm)
            setErr(true);
        else {
            setErr(false);

            let form = new FormData();
            for (let k in user)
                if (k !== 'confirm')
                    if (k === 'avatar') {
                        form.append(k, {
                            uri: user.avatar.uri,
                            name: user.avatar.fileName,
                            type: user.avatar.type
                        });

                    } else
                        form.append(k, user[k]);

            setLoading(true);
            console.log(form)
            try {
                let res = await API.post(endpoints['register'], form, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                if (res.status === 201)
                    navigation.navigate("Login");
            } catch (ex) {
                console.error(ex.response.data);
            } finally {
                setLoading(false);
            }

        }
    }

    return (
        <View className="flex-1 bg-white" style={themeColors.bg}>
            <SafeAreaView className="flex">
                <View className="flex-row justify-start">
                    <TouchableOpacity onPress={() => navigation.goBack()} className="bg-yellow-400 p-2 rounded-tr-2xl rounded-bl-2xl ml-4">
                        <ArrowLeftIcon size="20" color="black" />
                    </TouchableOpacity>
                </View>
                <View className="flex-row justify-center">
                    <Image style={{width: 150, height: 150}} source={require("../../assets/images/login.png")}/>
                </View>
            </SafeAreaView>
            <ScrollView View className="flex-1 bg-white px-11 pt-2" style={{borderTopLeftRadius: 50, borderTopRightRadius: 50}}>
                <View className="form space-y-2">
                    <Text className="text-gray-700 ml-4">Fist Name</Text>
                    <TextInput key="first_name" onChangeText={t => updateSate(t,"first_name")} className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3" placeholder="Enter First Name"/>

                    <Text className="text-gray-700 ml-4">Last Name</Text>
                    <TextInput key="last_name" onChangeText={t => updateSate(t,"last_name")} className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3" placeholder="Enter Last Name"/>
                    
                    <Text className="text-gray-700 ml-4">Email</Text>
                    <TextInput key="email" onChangeText={t => updateSate(t,"email")} className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3" placeholder="Enter email"/>


                    <Text className="text-gray-700 ml-4">Username</Text>
                    <TextInput key="username" onChangeText={t => updateSate(t,"username")} className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3" placeholder="Enter Username"/>

                    <Text className="text-gray-700 ml-4">Password</Text>
                    <TextInput key="password" onChangeText={t => updateSate(t,"password")} className="p-4 bg-gray-100 text-gray-700 rounded-2xl" secureTextEntry placeholder="Enter Password"/>

                    <Text className="text-gray-700 ml-4">Confirm Password</Text>
                    <TextInput key="confirm" onChangeText={t => updateSate(t,"confirm")} className="p-4 bg-gray-100 text-gray-700 rounded-2xl" secureTextEntry placeholder="Enter Confirm"/>
                    
                    <TouchableRipple style={{margin: 5}} onPress={picker}>
                    <Text>Chọn ảnh đại diện...</Text>
                    </TouchableRipple>

                    {user.avatar && <Image source={{uri: user.avatar.uri}} style={{width:80, height:80, borderRadius:20}} />}

                    <TouchableOpacity className="flex items-end mb-5">
                        <Text className="text-gray-700">Forgot Password</Text>
                    </TouchableOpacity>
                    <TouchableOpacity loading={loading} onPress={register} className="py-3 bg-yellow-400 rounded-xl">
                        <Text className="font-xl font-blod text-center text-gray-700">Sign Up</Text>
                    </TouchableOpacity>
                </View>
                <Text className="text-xl text-gray-700 font-blod text-center py-5">Or</Text>
                <View className="flex-row justify-center space-x-12">
                    <TouchableOpacity className="p-2 bg-gray-100 rounded-2xl">
                        <Image className="w-10 h-10" source={require("../../assets/icons/google.png")}/>
                    </TouchableOpacity>
                    <TouchableOpacity className="p-2 bg-gray-100 rounded-2xl">
                        <Image className="w-10 h-10" source={require("../../assets/icons/apple.png")}/>
                    </TouchableOpacity>
                    <TouchableOpacity className="p-2 bg-gray-100 rounded-2xl">
                        <Image className="w-10 h-10" source={require("../../assets/icons/facebook.png")}/>
                    </TouchableOpacity>
                </View>
                <View className="flex-row justify-center mt-7">
                        <Text className="text-gray-500 font-semibold">Don't have an account?</Text>
                        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                            <Text className="font-semibold text-yellow-400">Login</Text>
                        </TouchableOpacity>
                </View>
            </ScrollView>
           
        </View>
    )
}