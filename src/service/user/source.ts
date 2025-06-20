import dataxios from "@/lib/axios.wrapper/axios.data";

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
    const res = await dataxios.get(`/application/install-hubspot?prefix=${prefix}`)
    return res.data;
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