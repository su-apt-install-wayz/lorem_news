"use server";

import { Article } from "@/components/articles/ArticlesList";
import { createApiServer } from "@/lib/apiServer";

export async function getArticles(): Promise<Article[]> {
    try {
        const api = await createApiServer();
        const res = await api.get("/api/articles");
        return (res.data as Article[]) ?? [];
    } catch (e) {
        console.error("Erreur getArticles:", e);
        return [];
    }
}
