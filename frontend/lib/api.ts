import { getSession } from "next-auth/react"
import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080",
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use(async (config) => {
    const session = await getSession();

    console.log("Session", session?.user?.token);

    if (session?.user?.token) {
        config.headers.Authorization = `Bearer ${session.user.token}`
    }

    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;