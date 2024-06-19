import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserApi } from "../../APis/UserApi";



export const UPDATE_PROFILE = 'Update profile';
export const UPDATE_USERNAME = 'Update username';
export const LOGOUT = 'LOGOUT';







const initialState = {
    id: null,
    first_name: null,
    last_name: null,
    username: null,
    role: null,
    email: null,
    avatar: null,
}

export default function actionInforReducer(state = initialState, payload) {
    switch (payload.type) {
        case UPDATE_USERNAME:
            return {
                ...state,
                username: payload.username,
            }
        case UPDATE_PROFILE:
            return {
                id: payload?.data?.id ?? state.id,
                first_name: payload?.data?.first_name ?? state.first_name,
                last_name: payload?.data?.last_name ?? state.last_name,
                username: payload?.data?.username ?? state.username,
                role: payload?.data?.role ?? state.role,
                email: payload?.data?.email ?? state.email,
                avatar: payload?.data?.avatar ?? state.avatar,
            }
        case LOGOUT:
            return initialState;
        default:
            return state
    }

}

export const login = (username, password) => async dispatch => {
    try {
        const response = await UserApi.getToken({
            "grant_type": "password",
            "username": username,
            "password": password,
            "client_id":"Gvp0f3SuubSVbPEJZCy87KjqEd5RwODQUiYhIZiK",
            "client_secret": "CRbU7AvDYuvKslP8ZzSjf4yGQQegl8yQaolYGkFT836VUs4YFRn8YH7TJzRHT2xNYC0HqQ2KZFxXdQPyCcUxgEx4FS7OnF2WZNQtcfMfePSHQM3jD7WVKISKqWh2xub5"
            ,
        });

        const data = response.data;
        console.log(data.access_token)

        await AsyncStorage.setItem("token", data.access_token);
        setTimeout(async () => {
            const userReponse = await UserApi.getUser(data.access_token)

            await dispatch({
                type: UPDATE_PROFILE,
                data: userReponse.data
            })

        }, 100)
        return Promise.resolve(data.access_token)
        

    } catch (error) {
        console.log('Error:', error);
        return Promise.reject(error);
    }
    finally {

    }
};

export const logout = () => async dispatch => {
    try {


        await AsyncStorage.removeItem("token");

        dispatch({
            type:LOGOUT,
        })


    } catch (error) {
        console.log('Error:', error);
    }
    finally {

    }
};



export const userActions = {
    login,
    logout
};

