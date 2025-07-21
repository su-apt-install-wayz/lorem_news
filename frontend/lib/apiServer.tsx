import axios from "axios";
import { getToken } from "next-auth/jwt";
import { cookies } from "next/headers";

export async function createApiServer() {
    const cookieHeader = (await cookies()).toString();

    const token = await getToken({
        req: { headers: { cookie: cookieHeader } },
        secret: process.env.NEXTAUTH_SECRET!,
    });

    const api = axios.create({
        baseURL: "http://localhost:8080",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            ...(token && token.accessToken ? { Authorization: `Bearer ${token.accessToken}` } : {}),
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
