"use server";

import { revalidatePath } from "next/cache";
import { createApiServer } from "@/lib/apiServer";
import { Article } from "@/components/articles/ArticlesList";
import { isAxiosError } from "axios";

export type CommentItem = {
    id: number;
    content: string;
    created_at: string;
    edited_at?: string | null;
    article: { id: number };
    user: { id: number; username: string; picture: string };
};

export async function getArticleBySlug(slug: string): Promise<Article | null> {
    const api = await createApiServer();
    try {
        const res = await api.get(`/api/articles/slug/${encodeURIComponent(slug)}`);
        return (res.data as Article) ?? null;
    } catch (e) {
        if (isAxiosError(e) && e.response?.status === 404) return null;
        console.error("❌ Erreur getArticleBySlug :", e);
        throw new Error("Impossible de charger l'article.");
    }
}

export async function getComments(articleId: number): Promise<CommentItem[]> {
    const api = await createApiServer();
    try {
        const res = await api.get(`/api/comments?article=${encodeURIComponent(String(articleId))}`);
        const arr: CommentItem[] = res.data ?? [];
        return arr.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } catch (e) {
        console.error("❌ Erreur getComments :", e);
        throw new Error("Impossible de charger les commentaires.");
    }
}

// Low-level
export async function createComment(articleId: number, content: string): Promise<CommentItem | null> {
    try {
        const trimmed = (content ?? "").trim();
        if (!articleId || !trimmed) return null;

        const api = await createApiServer();
        const res = await api.post("/api/comments", { content: trimmed, article: { id: articleId } });
        return (res.data as CommentItem) ?? null;
    } catch (e) {
        console.error("❌ Erreur createComment :", e);
        return null;
    }
}

export async function updateComment(id: number, content: string): Promise<{ id: number; content?: string; edited_at?: string; deleted?: true } | null> {
    try {
        if (!id) return null;

        const api = await createApiServer();
        const trimmed = (content ?? "").trim();

        if (!trimmed) {
            await api.delete(`/api/comments/${encodeURIComponent(String(id))}`);
            return { id, deleted: true };
        }

        await api.patch(`/api/comments/${encodeURIComponent(String(id))}`, { content: trimmed });
        return { id, content: trimmed, edited_at: new Date().toISOString() };
    } catch (e) {
        console.error("❌ Erreur updateComment :", e);
        return null;
    }
}

export async function deleteComment(id: number): Promise<boolean> {
    try {
        if (!id) return false;

        const api = await createApiServer();
        await api.delete(`/api/comments/${encodeURIComponent(String(id))}`);
        return true;
    } catch (e) {
        console.error("❌ Erreur deleteComment :", e);
        return false;
    }
}

// High-level (avec revalidate)
export async function handleCreateComment(articleId: number, content: string, currentPath: string): Promise<CommentItem | null> {
    const created = await createComment(articleId, content);
    if (created) revalidatePath(currentPath);
    return created;
}

export async function handleUpdateComment(id: number, content: string, currentPath: string): Promise<{ id: number; content?: string; edited_at?: string; deleted?: true } | null> {
    const res = await updateComment(id, content);
    if (res) revalidatePath(currentPath);
    return res;
}

export async function handleDeleteComment(id: number, currentPath: string): Promise<boolean> {
    const ok = await deleteComment(id);
    if (ok) revalidatePath(currentPath);
    return ok;
}
