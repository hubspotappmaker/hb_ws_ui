import adminxios from "@/lib/axios.wrapper/axios.admin";
import { CreateTierDto, UpdateTierDto } from "@/lib/type/tier.type";


export const getAllTier = async (page: number, limit: number) => {
    const response = await adminxios.get(`/tier/get-all?page=${page}&limit=${limit}`);
    return response;
};


export const createTier = async (data: CreateTierDto) => {
    const response = await adminxios.post("/tier/create", data);
    return response;
};


export const getTierDetail = async (id: string) => {
    const response = await adminxios.get(`/tier/${id}`);
    return response;
};


export const updateTier = async (id: string, data: UpdateTierDto) => {
    const response = await adminxios.put(`/tier/update/${id}`, data);
    return response;
};


export const deleteTier = async (id: string) => {
    const response = await adminxios.delete(`/tier/delete/${id}`);
    return response;
};
