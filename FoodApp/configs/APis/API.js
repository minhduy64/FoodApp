import axios from "axios";
import { BaseUrl } from "../config";

export const endpoints = {'register': '/users/',
    'categories': '/categories/',
    'menuItems': '/menuItems/',
    'stores': '/stores/',
    'menuStores': (storeId) => `/stores/${storeId}/menu_items/` 
}

export const authApi = (token) => {
     return axios.create({
        baseURL: BaseUrl,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
        }
     })
}

export default axios.create({
    baseURL: BaseUrl,
    headers: {
        'Content-Type': 'multipart/form-data'
    }
})