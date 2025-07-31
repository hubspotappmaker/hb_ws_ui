import adminxios from "@/lib/axios.wrapper/axios.admin";

export const getAllAccount = async (page: number, limit: number) => {
    const response = await adminxios.get(`/user/get-all?page=${page}&limit=${limit}`);
    return response;
};

export const changeUserStatus = async (id: string, status: boolean) => {
    const response = await adminxios.put(`/user/change-status/${id}?status=${status}`);
    return response;
};


export const changeUserTier = async (id: string, tierID: string) => {
    const response = await adminxios.put(`/user/change-tier/${id}?tierID=${tierID}`);
    return response;
};

export const getSourceAccount = async (page: number, limit: number) => {
    const response = await adminxios.get(`/user/get-source?page=${page}&limit=${limit}`);
    return response;
};

export const getQueueSourceAccount = async (page: number, limit: number) => {
    const response = await adminxios.get(`/user/get-queue-source?page=${page}&limit=${limit}`);
    return response;
};

export const deleteAccount = async (id: string) => {
    const response = await adminxios.delete(`/user/delete-account/${id}`);
    return response;
};

export const checkExpired = async (id: string) => {
    const response = await adminxios.get(`/user/check-expired/${id}`);
    return response;
};

export const setExpiredStatus = async (id: string, status: boolean) => {
    const response = await adminxios.patch(`/user/change-expired-status/${id}/${status}`);
    return response;
};

export const setExpiredDate = async (id: string, date: Date) => {
    const response = await adminxios.post(`/user/set-expired-date/${id}/${date}`);
    return response;
};

export const countUploadAction = async (id: string) => {
    const response = await adminxios.get(`/logs/count/user/${id}`);
    return response;
};