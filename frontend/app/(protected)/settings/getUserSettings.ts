import { createApiServer } from "@/lib/apiServer";

export async function getUserSettings() {
    try {
        const api = await createApiServer();
        const response = await api.get("/api/users/1");
        return response.data;
    } catch (e) {
        console.error("Erreur serveur API Platform :", e);
        throw new Error("Impossible de charger les articles.");
    }
}
