import { createApiServer } from "@/lib/apiServer";

export async function getArticles() {
    try {
        const api = await createApiServer();
        const response = await api.get("/api/articles");
        return response.data;
    } catch (e) {
        console.error("Erreur serveur API Platform :", e);
        throw new Error("Impossible de charger les articles.");
    }
}
