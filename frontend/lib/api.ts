import { getSession } from "next-auth/react"
import axios from "axios";

const api = axios.create({
    baseURL: process.env.API_URL,
    headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use(async (config) => {
    const session = await getSession();

    console.log("Session", session?.user?.token);

    if (session?.user?.token) {
        config.headers.Authorization = `Bearer ${session.user.token}`
    }

    if (config.method === "patch") {
        config.headers["Content-Type"] = "application/merge-patch+json";
    }

    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;