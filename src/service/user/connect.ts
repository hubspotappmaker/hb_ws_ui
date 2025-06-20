import dataxios from "@/lib/axios.wrapper/axios.data";

export const softDeleteConnect = async (source_id: string) => {
    const res = await dataxios.delete(`/connect/delete/${source_id}`)
    return res;
}

export const disableConnect = async (source_id: string) => {
    const res = await dataxios.patch(`/connect/disable/${source_id}`)
    return res;
}

export const enableConnect = async (source_id: string) => {
    const res = await dataxios.patch(`/connect/enable/${source_id}`)
    return res;
}



export const getAllConnect = async (page: number, limit: number) => {
    const res = await dataxios.get(`/connect/get-all?page=${page}&limit=${limit}`)
    return res;
}

export const getDetailConnect = async (id_connect: string) => {
    const res = await dataxios.get(`/connect/get-by-id/${id_connect}`)
    return res;
}

export const startSyncData = async (id_connect: string, body: any) => {
    const res = await dataxios.post(`/migrate/start/${id_connect}`, body)
    return res;
}

export const createConnect = async (
    data: {
        connectName: string,
        from: string,
        to: string,
    }
) => {
    const response = await dataxios.post('/connect/create', data);
    return response;
};

export const udpateConnect = async (body: {
    id: string,
    name: string
}) => {
    const res = await dataxios.patch(`/connect/update`, body)
    return res;
}
