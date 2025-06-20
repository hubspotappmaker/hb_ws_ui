import { message } from "antd";
import axios from "axios";

const adminxios = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACK_END_ADMIN_URL
});

adminxios.interceptors.request.use(function (config) {
    if (typeof window !== "undefined" && window && window.localStorage &&
        window.localStorage.getItem('access_token'))
    {
        config.headers.Authorization = 'Bearer ' + window.localStorage.getItem('access_token');
    }
    return config;
}, function (error) {
    return Promise.reject(error);
});

adminxios.interceptors.response.use(function (response) {
    if (response.data && response.data.data)
    {
        return response.data
    }
    return response;
}, function (error) {
    if (error.response && error.response.data)
    {
        if (error.response.data.msg && error.response.data.msg !== 'Unauthorized')
        {
            message.error(error.response.data.msg)
        }
        return error.response.data
    }
});

export default adminxios