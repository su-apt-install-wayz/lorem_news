import axios from "axios";
import { getSession } from "next-auth/react";

export async function axiosWithoutAuth() {
    return axios.create({
        baseURL: "http://localhost:88/api",
    });
}

export async function axiosWithAuth() {
    const session = await getSession();
    if (!session?.accessToken) {
        throw new Error("No access token available");
    }

    return axios.create({
        baseURL: "http://localhost:88/api",
        headers: {
            Authorization: `Bearer ${session.accessToken}`,
        },
    });
}
