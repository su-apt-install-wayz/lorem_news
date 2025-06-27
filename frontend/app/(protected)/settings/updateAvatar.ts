"use server";

import { createApiServer } from "@/lib/apiServer";


export async function updateAvatar(userId: number, avatar: string) {
    try {
        const api = await createApiServer();
        await api.patch(`/users/${userId}`, { picture: avatar })
        return { success: true }
    } catch (e) {
        console.error('Erreur changement avatar', e)
        return { success: false }
    }
}
