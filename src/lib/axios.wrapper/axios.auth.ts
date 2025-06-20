import { message } from "antd";
import axios from "axios";

// Set config defaults when creating the authxios
const authxios = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACK_END_AUTH_URL
});

// Add a request interceptor
authxios.interceptors.request.use(function (config) {

    return config;
}, function (error) {
    // Do something with request error
    return Promise.reject(error);
});

authxios.interceptors.response.use(function (response: any) {
    if (response.data && response.data.data)
    {
        message.success(response.data.msg)
        return response.data
    }
    return response;
}, function (error) {
    console.log("err")
    if (error.response && error.response.data)
    {
        if (error.response.data.msg && error.response.data.msg !== 'Unauthorized')
        {
            message.error(error.response.data.msg)
        }
        return error.response.data
    }
});

export default authxios