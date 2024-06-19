import React from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { themeColors } from '../../theme';
import { useNavigation } from '@react-navigation/native';

export default PaymentWebView = ({route}) => {
  const navigation = useNavigation();
  const payUrl = route.params.payUrl;

  const onCancelPressed = () => {
    navigation.goBack()
    Alert.alert("Payment failed")
  }
  const onConfirmPressed = () => {
    navigation.navigate("Home")
    Alert.alert("Payment sucessful")
  }

  return (
    <View className="flex-1">
          <WebView
      source={{ uri: payUrl }}
      style={{ flex: 1 }}  
      javaScriptEnabled={true} 
      scalesPageToFit={true}  
    />
    <View className="bg-gray-50 flex-row justify-between bottom-1 h-14">
    <TouchableOpacity onPress={onCancelPressed} className="shadow-sm w-1/2 bg-white items-center h-full justify-center rounded-full" style={{backgroundColor:themeColors.text}}>
        <Text className="text-white font-bold">Cancel</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={onConfirmPressed} className="shadow-sm w-1/2 bg-white items-center h-full justify-center rounded-full" style={{backgroundColor:themeColors.text}}>
        <Text className="text-white font-bold">Confirm</Text>
    </TouchableOpacity>

    </View>

    </View>
  
  );
}

