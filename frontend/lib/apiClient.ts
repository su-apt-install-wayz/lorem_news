import axios from "axios";
import { getSession } from "next-auth/react";

const apiClient = axios.create({
    baseURL: "http://localhost:8080",
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
    },
});

apiClient.interceptors.request.use(async (config) => {
    const session = await getSession();

    if (session?.user?.token) {
        config.headers.Authorization = `Bearer ${session.user.token}`;
    }

    if (config.method === "patch") {
        config.headers["Content-Type"] = "application/merge-patch+json";
    }

    return config;
});

export default apiClient;
