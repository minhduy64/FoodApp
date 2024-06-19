import axios from "axios"
import { BaseUrl } from "../config";

export const SearchApi = {
    getStores: function (params) {
        return axios.get(`${BaseUrl}stores/search_stores/?q=${params}`
        );
    }

}