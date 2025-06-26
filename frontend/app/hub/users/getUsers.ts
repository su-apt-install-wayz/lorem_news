import { createApiServer } from "@/lib/apiServer";

export async function getUsers() {
    try {
        const api = await createApiServer();
        const response = await api.get("/api/users");
        return response.data;
    } catch (e) {
        console.error("Erreur serveur API Platform :", e);
        throw new Error("Impossible de charger les utilisateurs.");
    }
}
