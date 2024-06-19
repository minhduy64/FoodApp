import { Image, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context"
import themeColors from "../../theme/Styles";
import { useNavigation } from "@react-navigation/native";


export default function WelcomeScreen() {

    const navigation = useNavigation();

    return (
        <SafeAreaView class="flex-1" style={themeColors.bg}>
            <View className="flex-1 flex flex-colunm justify-around my-4">
                <Text className="text-white font-bold text-center text-4xl">Welcome to Eat World!</Text>
                <View className="flex-row justify-center">
                    <Image style={{width: 350, height: 350}} source={require("../../assets/images/login.png")}/>
                </View>
                <View className="space-y-4">
                    <TouchableOpacity className="py-3 bg-yellow-400 mx-7 rounded-xl"
                                      onPress={() => navigation.navigate("SignUp")} >
                          <Text className="text-xl font-bold text-center text-gray-700">
                              Sign Up
                          </Text>
                    </TouchableOpacity>
                    <View className="flex-row justify-center">
                        <Text className="text-white font-semibold">Already have an account</Text>
                        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                            <Text className="font-semibold text-yellow-400">Login</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </View>
        </SafeAreaView>
    )
}