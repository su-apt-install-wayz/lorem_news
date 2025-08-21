"use client";

import { useState } from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { EllipsisVertical, Flag, LoaderCircle as LoaderCircleIcon, Pencil, Save, Trash2 } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { CommentItem } from "@/app/articles/[article-id]/actions";

export default function CommentLine({ comment, onUpdate, onDelete, pending }: { comment: CommentItem; onUpdate: (id: number, content: string) => void; onDelete: (id: number) => void; pending: boolean; }) {
    const [isEditing, setIsEditing] = useState(false);
    const [content, setContent] = useState(comment.content);
    const [confirmOpen, setConfirmOpen] = useState(false);

    const canEdit = comment.user.id === 1; // adapter avec Auth si besoin

    return (
        <div className="flex gap-3 items-start">
            <Avatar className="w-10 h-10 border-4">
                <AvatarImage src={`/assets/profile/${comment.user?.picture ?? "Ander.png"}`} />
            </Avatar>
            <div className="w-full space-y-1">
                <div className="flex justify-between items-center gap-2">
                    <div className="flex items-center gap-2">
                        <p>{comment.user?.username}</p>
                        <p className="text-sm text-muted-foreground">{new Date(comment.created_at).toLocaleDateString("fr-FR")}</p>
                        {comment.edited_at && <p className="text-xs text-muted-foreground">(modifié)</p>}
                        {pending && <LoaderCircleIcon className="h-4 w-4 animate-spin text-muted-foreground" />}
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost"><EllipsisVertical className="text-muted-foreground" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            {canEdit && (
                                <>
                                    <DropdownMenuItem onClick={() => setIsEditing(true)}>
                                        <Pencil />
                                        <span>Modifier</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setConfirmOpen(true)}>
                                        <Trash2 />
                                        <span>Supprimer</span>
                                    </DropdownMenuItem>
                                </>
                            )}
                            <DropdownMenuItem>
                                <Flag />
                                <span>Signaler</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {isEditing ? (
                    <div className="space-y-2">
                        <Textarea value={content} onChange={(e) => setContent(e.target.value)} className="min-h-max" placeholder="Contenu de votre commentaire..." disabled={pending} />
                        <div className="flex gap-2">
                            <Button size="sm" disabled={pending} onClick={() => { setIsEditing(false); onUpdate(comment.id, content); }}>
                                {pending ? (
                                    <>
                                        <LoaderCircleIcon className="animate-spin h-6 w-6 text-primary-foreground" />
                                        <span>Envoi</span>
                                    </>
                                ) : (
                                    <>
                                        <Save className="h-6 w-6 text-primary-foreground" />
                                        <span>Enregistrer</span>
                                    </>
                                )}
                            </Button>
                            <Button variant="outline" size="sm" disabled={pending} onClick={() => { setIsEditing(false); setContent(comment.content); }}>Annuler</Button>
                        </div>
                    </div>
                ) : (
                    <p className="max-sm:text-sm">{comment.content}</p>
                )}
            </div>

            <AlertDialog open={confirmOpen} onOpenChange={(o) => !pending && setConfirmOpen(o)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Supprimer ce commentaire ?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Cette action est irréversible. Le commentaire sera définitivement supprimé.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={pending}>Annuler</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-destructive text-destructive-foreground hover:opacity-90"
                            onClick={async (e) => {
                                e.preventDefault();
                                onDelete(comment.id);
                                setConfirmOpen(false);
                            }}
                            disabled={pending}
                        >
                            {pending ? <LoaderCircleIcon className="animate-spin h-6 w-6 text-primary-foreground" /> : null}
                            <span>Supprimer</span>
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}