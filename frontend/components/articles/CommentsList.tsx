"use client";

import { useOptimistic, useState, useTransition } from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { LoaderCircle as LoaderCircleIcon } from "lucide-react";
import { CommentItem, handleCreateComment, handleDeleteComment, handleUpdateComment } from "@/app/articles/[article-id]/actions";
import { Skeleton } from "@/components/ui/skeleton";
import CommentLine from "./CommentLine";
import { toast } from "sonner";

type CommentsAction =
    | { type: "add"; comment: CommentItem }
    | { type: "replaceTemp"; tempId: number; real: CommentItem }
    | { type: "update"; id: number; content: string }
    | { type: "delete"; id: number };

function sortComments(list: CommentItem[]) {
    return [...list].sort((a, b) => {
        const aSelf = a.user.id === 2;
        const bSelf = b.user.id === 2;
        if (aSelf && !bSelf) return -1;
        if (!aSelf && bSelf) return 1;
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
}

export function CommentsListLoading() {
    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center space-x-2">
                <Skeleton className="h-6 w-48 bg-muted" />
                <Skeleton className="h-8 w-24 bg-muted" />
            </div>
            <div className="flex gap-3 items-start">
                <Skeleton className="w-10 h-10 border-4 rounded-full bg-muted" />
                <Skeleton className="w-full h-12 bg-muted" />
            </div>
            {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex gap-3 items-start">
                    <Skeleton className="w-10 h-10 border-4 rounded-full bg-muted" />
                    <div className="space-y-1 w-full">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-2">
                                <Skeleton className="w-36 h-5 bg-muted" />
                                <Skeleton className="h-5 w-24 bg-muted" />
                            </div>
                            <Skeleton className="h-10 w-10 bg-muted" />
                        </div>
                        <Skeleton className="w-full h-4 bg-muted" />
                        <Skeleton className="w-10/12 h-4 bg-muted" />
                    </div>
                </div>
            ))}
        </div>
    );
}

export default function CommentsList({ initialComments, articleId, currentPath }: { initialComments: CommentItem[]; articleId: number; currentPath: string; }) {
    const [adding, startAddTransition] = useTransition();
    const [rowPending, startRowTransition] = useTransition();
    const [rowBusyId, setRowBusyId] = useState<number | null>(null);
    const [newComment, setNewComment] = useState("");

    const [comments, apply] = useOptimistic<CommentItem[], CommentsAction>(
        initialComments,
        (state, action): CommentItem[] => {
            switch (action.type) {
                case "add":
                    return sortComments([action.comment, ...state]);
                case "replaceTemp":
                    return sortComments(state.map((c) => (c.id === action.tempId ? action.real : c)));
                case "update":
                    return state.map((c) =>
                        c.id === action.id ? { ...c, content: action.content, edited_at: new Date().toISOString() } : c
                    );
                case "delete":
                    return state.filter((c) => c.id !== action.id);
                default:
                    return state;
            }
        }
    );

    async function onAdd() {
        const content = newComment.trim();
        if (!content) return;

        const tempId = -Date.now();
        const temp: CommentItem = { id: tempId, content, created_at: new Date().toISOString(), article: { id: articleId }, user: { id: 1, username: "Vous", picture: "Ander.png" } }; // changer avec le vrai username et picture
        setNewComment("");

        startAddTransition(() => apply({ type: "add", comment: temp }));
        try {
            const created = await handleCreateComment(articleId, content, currentPath);
            if (created) {
                startAddTransition(() => apply({ type: "replaceTemp", tempId, real: created }));
                toast.success("Commentaire ajouté.");
            }
            else {
                startAddTransition(() => apply({ type: "delete", id: tempId }));
                toast.error("Erreur lors de l'ajout du commentaire.");
            }
        } catch {
            startAddTransition(() => apply({ type: "delete", id: tempId }));
            toast.error("Erreur réseau/serveur lors de l’ajout.");
        }
    }

    async function onUpdate(id: number, content: string) {
        setRowBusyId(id);
        startRowTransition(() => apply({ type: "update", id, content }));
        try {
            const res = await handleUpdateComment(id, content, currentPath);
            if (res) {
                toast.success("Commentaire modifié.");
            } else {
                toast.error("Erreur lors de la modification.");
            }
        } catch {
            toast.error("Erreur réseau/serveur lors de la modification.");
        } finally {
            setRowBusyId(null);
        }
    }

    async function onDelete(id: number) {
        setRowBusyId(id);
        startRowTransition(() => apply({ type: "delete", id }));
        try {
            const res = await handleDeleteComment(id, currentPath);
            if (res) {
                toast.success("Commentaire supprimé.");
            } else {
                toast.error("Erreur lors de la suppression.");
            }
        } catch {
            toast.error("Erreur réseau/serveur lors de la suppression.");
        } finally {
            setRowBusyId(null);
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center gap-2">
                <h3 className="text-xl font-semibold">Commentaires ({comments.length})</h3>
                <Button size="sm" className="ml-auto" onClick={onAdd} disabled={adding || rowPending || newComment.trim() === ""}>
                    {adding ? (
                        <>
                            <LoaderCircleIcon className="animate-spin h-6 w-6 text-primary-foreground" />
                            <span>Ajout</span>
                        </>
                    ) : (
                        <span>Ajouter</span>
                    )}
                </Button>
            </div>

            <div className="flex gap-3 items-start">
                <Avatar className="w-10 h-10 border-4">
                    <AvatarImage src={`/assets/profile/Ander.png`} />
                </Avatar>
                <Textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} className="min-h-max" placeholder="Écrivez un commentaire..." disabled={adding || rowPending} />
            </div>

            {comments.length === 0 ? (
                <p className="text-muted-foreground">Aucun commentaire pour le moment. Écrivez le premier commentaire sur cet article.</p>
            ) : (
                comments.map((comment) => (
                    <CommentLine key={comment.id} comment={comment} onUpdate={onUpdate} onDelete={onDelete} pending={rowPending && rowBusyId === comment.id} />
                ))
            )}
        </div>
    );
}