import { notification } from "antd";
import { API_URL, REQUEST_TYPE } from "../constants/api-constants";

export const globalFetch = (
    endpoint,
    method = REQUEST_TYPE.GET,
    body = null,
    query = "",
    isProtected = true
) => {
    const options = { method };
    if (body) {
        options.body = JSON.stringify(body);
        options.headers = {
            'Content-Type': 'application/json'
        }
    }
    if (isProtected) {
        options.headers = {
            'Content-Type': 'application/json',
            'authorization': localStorage.getItem("auth-token")
        };
    }
    let qs = "";
    if (query) {
        qs = "?" + new URLSearchParams(query).toString();
    }
    return fetch(API_URL + endpoint + qs, options).then(async (res) => {
        const response = await res.json();
        const { toast, message } = response;
        if (toast) {
            notification.success({
                message,
            });
        }
        return response;
    });
};
