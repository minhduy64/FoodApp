import { useState } from "react";
import { Alert, Button, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import * as Icon from "react-native-feather";
import { themeColors } from "../../theme";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserApi } from "../../configs/APis/UserApi";

export default ChangePassScreen = () => {
  const navigation = useNavigation()
  const [confirmPassword, setConfirmPassword] = useState({confirm_password:""})
  const [infoChangePassword, setChangePassword] = useState({
    old_password:'',
    new_password:''
  })

  const handleChangePassword = (name) => (value) => {
    setChangePassword({ ...infoChangePassword, [name]: value });
  };

  const onChangePassPressed = async () => {
    const token = await AsyncStorage.getItem('token');
    const res = await UserApi.getUser(token)
    const user = res.data
    let form = new FormData();
    form.append(user);
    form.append('old_password',infoChangePassword.old_password)
    form.append('new_password',infoChangePassword.new_password)
    console.log(form)
    try {
        const res = await UserApi.changePassword(form, token)
        if (res.status == 200) {
          Alert.alert("Updated password successfully", "Success")
        } else
          Alert.alert("old password is incorrect", "Fail")
  
      } catch (error) {
          Alert.alert("old password is incorrect", "Fail")
      }
  }

    return (
        <View className="bg-white flex-1">
            <View className="relative py-32 shadow-sm">
                <TouchableOpacity onPress={() => navigation.goBack()} className="absolute z-10 top-10 left-2 bg-gray-700 p-2 rounded-full shadow">
                    <Icon.ArrowLeft strokeWidth={3} stroke={themeColors.bgColor(1)} />
                </TouchableOpacity>
                <View>
                <Text className="text-center font-bold text-xl">Change password</Text>
               </View>
            </View>
            <ScrollView className="space-y-2 bottom-20">
                    <Text className="text-gray-700 ml-4">Old Password</Text>
                    <TextInput key="old_password" value={infoChangePassword.old_password} onChangeText={handleChangePassword('old_password')} className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3" placeholder="Enter Old Password"/>

                    <Text className="text-gray-700 ml-4">New Password</Text>
                    <TextInput key="new_password" value={infoChangePassword.new_password} onChangeText={handleChangePassword('new_password')} className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3" placeholder="Enter New Password"/>
                    
                    <Text className="text-gray-700 ml-4">Confirm Password</Text>
                    <TextInput key="confirm_password" value={confirmPassword.confirm_password}  onChangeText={t => setConfirmPassword({confirm_password:t})} className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3" placeholder="Enter Confirm Password"/>
                    <TouchableOpacity onPress={onChangePassPressed} className="py-3 bg-yellow-400 rounded-xl" >
                        <Text className="font-xl font-bold text-center text-gray-700">Change</Text>
                    </TouchableOpacity>
            </ScrollView>
        </View>
      
    )
}
