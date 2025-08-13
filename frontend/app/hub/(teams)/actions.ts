"use server";

import { Team } from "@/components/hub/teams/TeamsList";
import { createApiServer } from "@/lib/apiServer";
import { revalidatePath } from "next/cache";

export async function getTeams(): Promise<Team[]> {
    try {
        const api = await createApiServer();
        const res = await api.get("/api/teams");
        return res.data ?? [];
    } catch (e) {
        console.error("Erreur getTeams:", e);
        return [];
    }
}

export async function createTeam(payload: { name: string; leaderId: number; memberIds: number[] }): Promise<{ success: boolean; message?: string }> {
    try {
        const api = await createApiServer();
        await api.post("/api/teams", {
            name: payload.name,
            leader: `/api/users/${payload.leaderId}`,
            membersInput: payload.memberIds,
        });
        return { success: true };
    } catch (e) {
        console.error("Erreur createTeam:", e);
        return { success: false, message: "Une erreur est survenue lors de la création." };
    }
}

export async function updateTeam(id: number, payload: { name: string; leaderId: number; memberIds: number[] }): Promise<{ success: boolean; message?: string }> {
    try {
        const api = await createApiServer();
        await api.patch(`/api/teams/${id}`, {
            name: payload.name,
            leader: `/api/users/${payload.leaderId}`,
            membersInput: payload.memberIds,
        });
        return { success: true };
    } catch (e) {
        console.error("Erreur updateTeam:", e);
        return { success: false, message: "Une erreur est survenue lors de la modification." };
    }
}

export async function deleteTeams(ids: number[]): Promise<number[]> {
    const api = await createApiServer();
    const failed: number[] = [];

    await Promise.all(
        ids.map(async (id) => {
            try {
                await api.delete(`/api/teams/${id}`);
            } catch (e) {
                console.error(`Erreur deleteTeam ${id}:`, e);
                failed.push(id);
            }
        })
    );

    return failed;
}

export async function searchLeaders(searchQuery: string) {
    try {
        const api = await createApiServer();
        const res = await api.get("/api/users", {
            params: {
                searchQuery,
                roles: "ROLE_LEADER",
                inTeam: false,
            },
        });
        return res.data ?? [];
    } catch (e) {
        console.error("Erreur searchLeaders:", e);
        return [];
    }
}

export async function searchWriters(searchQuery: string) {
    try {
        const api = await createApiServer();
        const res = await api.get("/api/users", {
            params: {
                searchQuery,
                roles: "ROLE_MEMBER",
                inTeam: false,
            },
        });
        return res.data ?? [];
    } catch (e) {
        console.error("Erreur searchWriters:", e);
        return [];
    }
}

export async function handleCreateTeam(payload: { name: string; leaderId: number; memberIds: number[] }) {
    const res = await createTeam(payload);
    if (res.success) revalidatePath("/hub/teams");
    return res;
}

export async function handleUpdateTeam(id: number, payload: { name: string; leaderId: number; memberIds: number[] }) {
    const res = await updateTeam(id, payload);
    if (res.success) revalidatePath("/hub/teams");
    return res;
}

export async function handleDeleteTeams(ids: number[]): Promise<number[]> {
    const res = await deleteTeams(ids);
    revalidatePath("/hub/teams");
    return res;
}

export async function handleSearchLeaders(query: string) {
    const res = await searchLeaders(query);
    return res;
}

export async function handleSearchWriters(query: string) {
    const res = await searchWriters(query);
    return res;
}
