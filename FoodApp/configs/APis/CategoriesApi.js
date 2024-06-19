import axios from "axios"
import { BaseUrl } from "../config";

export const CategoriesApi = {
    getCategories: function () {
        return axios.post(`${BaseUrl}categories/`
        );
    },
    getStores: function (id) {
        return axios.get(`${BaseUrl}categories/${id}/Stores`
        );
    }

}