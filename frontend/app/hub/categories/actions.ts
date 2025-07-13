"use server";

import { createApiServer } from "@/lib/apiServer";

export async function getCategories() {
    const api = await createApiServer();
    try {
        const response = await api.get("/api/categories");
        return response.data;
    } catch (e) {
        console.error("❌ Erreur serveur API Platform :", e);
        throw new Error("Impossible de charger les catégories.");
    }
}

export async function createCategory(payload: { name: string; color: string }) {
    try {
        const api = await createApiServer();
        await api.post("/api/categories", payload);
        return true;
    } catch (e) {
        console.error("❌ Erreur création catégorie", e);
        return false;
    }
}

export async function updateCategory(id: number, payload: { name: string; color: string; }) {
    try {
        const api = await createApiServer();
        await api.patch(`/api/categories/${id}`, payload);
        return true;
    } catch (e) {
        console.error(`❌ Erreur mise à jour category ${id}`, e);
        return false;
    }
}

export async function deleteCategories(categoryIds: number[]): Promise<number[]> {
    const api = await createApiServer();
    const failed: number[] = [];

    await Promise.all(
        categoryIds.map(async (id) => {
            try {
                await api.delete(`/api/categories/${id}`);
            } catch (e) {
                console.error(`❌ Erreur suppression category ${id}`, e);
                failed.push(id);
            }
        })
    );

    return failed;
}
