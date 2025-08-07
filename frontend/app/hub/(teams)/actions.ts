"use server";

import { createApiServer } from "@/lib/apiServer";

export async function getTeams(): Promise<any[]> {
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
