"use server";

import { createApiServer } from "@/lib/apiServer";
import { revalidatePath } from "next/cache";

/* ==== Types ==== */
export type Category = {
    id: number;
    name: string;
    color: string;
};

type ApiViolation = {
    propertyPath: string;
    message: string;
};

type ApiError = {
    response?: {
        status: number;
        data?: { violations?: ApiViolation[] };
    };
};

/* Type guard */
const isApiError = (e: unknown): e is ApiError =>
    typeof e === "object" && e !== null && "response" in e;

/* ==== Actions ==== */
export async function getCategories(): Promise<Category[]> {
    try {
        const api = await createApiServer();
        const res = await api.get<Category[]>("/api/categories");
        return res.data;
    } catch (e) {
        console.error("❌ Erreur serveur API Platform :", e);
        throw new Error("Impossible de charger les catégories.");
    }
}

export async function createCategory(
    payload: Pick<Category, "name" | "color">
): Promise<{ success: true } | { success: false; message: string }> {
    try {
        const api = await createApiServer();
        await api.post("/api/categories", payload);
        return { success: true };
    } catch (e: unknown) {
        console.error("❌ Erreur création catégorie", e);

        if (isApiError(e) && e.response?.status === 422) {
            const nameError = e.response.data?.violations?.find(
                (v) => v.propertyPath === "name"
            );
            if (nameError) return { success: false, message: "Ce nom de catégorie existe déjà." };
            return { success: false, message: "Erreur de validation lors de la création." };
        }

        return { success: false, message: "Une erreur est survenue lors de la création." };
    }
}

export async function updateCategory(
    id: number,
    payload: Pick<Category, "name" | "color">
): Promise<{ success: true } | { success: false; message: string }> {
    try {
        const api = await createApiServer();
        await api.patch(`/api/categories/${id}`, payload);
        return { success: true };
    } catch (e: unknown) {
        console.error("❌ Erreur mise à jour catégorie", e);

        if (isApiError(e) && e.response?.status === 422) {
            const nameError = e.response.data?.violations?.find(
                (v) => v.propertyPath === "name"
            );
            if (nameError) return { success: false, message: "Ce nom de catégorie existe déjà." };
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

export async function handleCreateCategory(payload: { name: string; color: string; }) {
    const res = await createCategory(payload);
    if (res.success) {
        revalidatePath("/hub/categories");
    }
    return res;
}

export async function handleUpdateCategory(id: number, payload: { name: string; color: string; }) {
    const res = await updateCategory(id, payload);
    if (res.success) {
        revalidatePath("/hub/categories");
    }
    return res;
}

export async function handleDeleteCategories(ids: number[]): Promise<number[]> {
    const res = await deleteCategories(ids);
    revalidatePath("/hub/categories");
    return res;
}