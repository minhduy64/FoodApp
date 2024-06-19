import axios from "axios"
import { BaseUrl } from "../config";

export const PayApis = {
    PaymentOrders: function (params) {
        return axios.post(`${BaseUrl}momo/process_payment/`, params,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
    }

}