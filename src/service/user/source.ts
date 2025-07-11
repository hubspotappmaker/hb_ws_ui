import dataxios from "@/lib/axios.wrapper/axios.data";
import axios from "axios";

export const connectShopifyApi = async (data: {
    name: string;
    credentials: {
        shopUrl: string;
        shopName: string;
        accessToken: string;
    }
}) => {
    const response = await dataxios.post('/application/connect-shopify', data);
    return response;
};

export const connectHubspot = async (prefix: string) => {
    window.location.href = 'https://app-na2.hubspot.com/oauth/authorize?client_id=ed661cf6-11ca-4441-8f9f-dcc884d8e6f9&redirect_uri=https://gdrive.nexce.io/fe/api/hubspot/callback&scope=crm.objects.deals.read%20crm.objects.contacts.read'
}

export const connectGoogleDrive = async (prefix: string) => {
    const connect_gdrive = process.env.API_CONNECT_GDRIVE

    if (connect_gdrive)
    {
        const res = await axios.get(connect_gdrive)
        return res.data;
    } else
    {
        return null
    }

}

export const getAllSourceCrm = async (page: number, limit: number) => {
    const res = await dataxios.get(`/application/get-all?page=${page}&limit=${limit}&platform=crm`)
    return res;
}

export const getAllSourceEcommerce = async (page: number, limit: number) => {
    const res = await dataxios.get(`/application/get-all?page=${page}&limit=${limit}&platform=ecommerce`)
    return res;
}

export const getSourceById = async (id: string) => {
    const res = await dataxios.get(`/application/${id}`)
    return res;
}

export const getAllSource = async (page: number, limit: number) => {
    const res = await dataxios.get(`/application/get-all?page=${page}&limit=${limit}`)
    return res;
}

export const softDeleteSource = async (source_id: string) => {
    const res = await dataxios.delete(`/application/delete/${source_id}`)
    return res;
}

export const udpateSource = async (body: {
    id: string,
    name: string
}) => {
    const res = await dataxios.patch(`/application/update`, body)
    return res;
}

export const reAuthenShopidySource = async (id: string, body: {
    name: string,
    credentials: {
        shopUrl: string,
        shopName: string,
        accessToken: string
    }
}) => {
    const res = await dataxios.put(`/application/reauth-shopify/${id}`, body)
    return res;
}