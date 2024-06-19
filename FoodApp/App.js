import { StatusBar } from 'expo-status-bar';
import React, { useContext, useEffect, useReducer } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import WelcomeNavigation from './navigation/WelcomeNavigation';
import AppNavigation from './navigation/AppNavigation';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Icon } from 'react-native-paper';
import { Provider, useDispatch, useSelector } from 'react-redux';
import store from './configs/redux/store';
import actionInforReducer, { UPDATE_PROFILE } from './configs/redux/reducers/InfoReducer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserApi } from './configs/APis/UserApi';
import ProfileNavigation from './navigation/ProfileNavigation';


const Tab = createBottomTabNavigator();


const MyTab = () => {
  const dispatch = useDispatch();

  const loadToken = async () => {
    const token = await AsyncStorage.getItem("token");
    console.log(token)
    if(token)
      {
        const userReponse = await UserApi.getUser(token)
        await dispatch({
            type: UPDATE_PROFILE,
            data: userReponse.data
        })
      }
   
  }

  useEffect(()=> {
    loadToken();
  })

  const isLoggedIn = useSelector((state) => state.personalInfor.username);
  return (
    <>
      <Tab.Navigator initialRouteName='WelcomeNav' screenOptions={{
      tabBarHideOnKeyboard: true,
    }}>
      {isLoggedIn === null?<>

        <Tab.Screen name="WelcomeNav" component={WelcomeNavigation} options={{tabBarShowLabel:false, headerShown:false, tabBarIcon: () => null}} />
      </>:<>
        <Tab.Screen name="HomeApp" component={AppNavigation} options={{tabBarShowLabel:false, headerShown:false, tabBarIcon: () => <Icon size={30} color="gray" source="home" />}} />
        <Tab.Screen name="Profile" component={ProfileNavigation} options={{tabBarShowLabel:false, headerShown:false,  tabBarIcon: () => <Icon size={30} color="gray" source="account" />}} />
      </>}
      </Tab.Navigator>

    </>
      
  );
}


export default function App() {

  return (
    <NavigationContainer>
          <Provider store={store}>
              <MyTab />
          </Provider>
    </NavigationContainer>
  );
}