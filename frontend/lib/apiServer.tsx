// lib/apiServer.ts
import axios from "axios";
import { cookies } from "next/headers";

export async function createApiServer() {
    const cookieStore = await cookies(); // pas besoin de await
    const token = cookieStore.get("authjs.session-token")?.value;
console.log("Token from cookies:", token);

    const api = axios.create({
        baseURL: "http://localhost:8080",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
        },
    });

    api.interceptors.request.use((config) => {
        if (config.method === "patch") {
            config.headers["Content-Type"] = "application/merge-patch+json";
        }
        return config;
    });

    return api;
}
