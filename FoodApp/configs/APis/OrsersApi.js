import axios from "axios"
import { BaseUrl } from "../config";

export const OrdersApi = {
    createOrders: function (params) {
        return axios.post(`${BaseUrl}orders/create_orders/`, params);
    }

}