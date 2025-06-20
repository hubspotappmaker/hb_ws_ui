import authxios from "@/lib/axios.wrapper/axios.auth";
import dataxios from "@/lib/axios.wrapper/axios.data";

export const loginApi = async (email: string, password: string) => {
    const response = await authxios.post('/auth/sign-in', {
        email,
        password
    });
    return response;
};

export const registerApi = async (email: string, password: string, name: string) => {
    const response = await authxios.post('/auth/sign-up', {
        email,
        password,
        name
    });
    return response;
};

export const pingMe = async () => {
    const response = await dataxios.get('/me');
    console.log('response ping me: ', response)
    return response
}