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
        return { success: true };
    } catch (e: any) {
        console.error("❌ Erreur création catégorie", e);

        if (e.response?.status === 422) {
            const violations = e.response.data?.violations;
            const nameError = violations?.find((v: any) => v.propertyPath === "name");

            if (nameError) {
                return { success: false, message: "Ce nom de catégorie existe déjà." };
            }

            return { success: false, message: "Erreur de validation lors de la création." };
        }

        return { success: false, message: "Une erreur est survenue lors de la création." };
    }
}

export async function updateCategory(id: number, payload: { name: string; color: string; }) {
    try {
        const api = await createApiServer();
        await api.patch(`/api/categories/${id}`, payload);
        return { success: true };
    } catch (e: any) {
        console.error("❌ Erreur mise à jour  catégorie", e);

        if (e.response?.status === 422) {
            const violations = e.response.data?.violations;
            const nameError = violations?.find((v: any) => v.propertyPath === "name");

            if (nameError) {
                return { success: false, message: "Ce nom de catégorie existe déjà." };
            }

            return { success: false, message: "Erreur de validation lors de la modification." };
        }

        return { success: false, message: "Une erreur est survenue lors de la modification." };
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
