import dataxios from "@/lib/axios.wrapper/axios.data";
import { ShopifyModuleKey } from "@/lib/constant/shopify.constant";


export const changeMetafieldStatus = async (connect_id: string) => {
    const response = await dataxios.put(`/metafield/change-status/${connect_id}`)
    return response;
}

export const associateField = async (data: {
    connect: string,
    from: string,
    to: string
}) => {
    const response = await dataxios.put(`/metafield/associate`, data)
    return response;
}

export const releaseAssociate = async (from: string) => {
    const response = await dataxios.put(`/metafield/release-associate/${from}`)
    return response;
}

export const getFieldFrom = async (connect_id: string, module: ShopifyModuleKey) => {
    const response = await dataxios.get(`/metafield/from/${connect_id}/${module.toLocaleLowerCase()}`)
    return response;
}


export const getFieldTo = async (connect_id: string, module: ShopifyModuleKey) => {
    const response = await dataxios.get(`/metafield/to/${connect_id}/${module.toLocaleLowerCase()}`)
    return response;
}

export const createNewCustomHubspotField = async (data: {
    module: ShopifyModuleKey,
    name: string,
    connect_id: string
}) => {
    const response = await dataxios.post(`/metafield/create-customfield`, {
        connect_id: data.connect_id,
        name: data.name,
        module: data.module.toLocaleLowerCase()
    })
    return response;
}


