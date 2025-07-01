"use server";

import { createApiServer } from "@/lib/apiServer";

export async function getUsers() {
    const api = await createApiServer();
    try {
        const response = await api.get("/api/users");
        return response.data;
    } catch (e) {
        console.error("❌ Erreur serveur API Platform :", e);
        throw new Error("Impossible de charger les utilisateurs.");
    }
}

export async function deleteUsers(userIds: number[]): Promise<number[]> {
    const api = await createApiServer();
    const currentUserId = 1;
    const filteredIds = userIds.filter((id) => id !== currentUserId);

    const failed: number[] = [];

    await Promise.all(
        filteredIds.map(async (id) => {
            try {
                await api.delete(`/api/users/${id}`);
            } catch (e) {
                console.error(`❌ Erreur suppression user ${id}`, e);
                failed.push(id);
            }
        })
    );

    return failed;
}

