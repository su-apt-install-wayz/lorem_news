"use client";

import { useEffect, useState } from "react";
import { Section } from "@/components/Section";
import { Spacing } from "@/components/Spacing";
import api from "@/lib/api";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";
import CategoryBadge from "@/components/CategoryBadge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon, EllipsisVertical, Flag, LoaderCircleIcon, Pencil, Save, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button, buttonVariants } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader } from "@/components/ui/alert-dialog";
import { AlertDialogTitle } from "@radix-ui/react-alert-dialog";
import ScrollProgressBar from "@/components/ui/scroll-progress-bar";

export default function ArticlePage() {
    const params = useParams();
    const articleId = params["article-id"];

    const [article, setArticle] = useState<any>(null);
    const [loadingArticle, setLoadingArticle] = useState(true);
    const [errorArticle, setErrorArticle] = useState<string | null>(null);

    useEffect(() => {
        const fetchArticle = async () => {
            if (!articleId) return;

            try {
                setLoadingArticle(true);
                setErrorArticle(null);

                const res = await api.get(`/api/articles/slug/${articleId}`);

                setArticle(res.data);
                setLoadingArticle(false);
            } catch (err) {
                toast.error("Erreur lors du chargement de l'article.");
                setErrorArticle("Erreur lors du chargement de l'article.");
            }
        };
        fetchArticle();
    }, [articleId]);

    const [comments, setComments] = useState<any[]>([]);
    const [loadingComments, setLoadingComments] = useState(true);
    const [errorComments, setErrorComments] = useState<string | null>(null);

    useEffect(() => {
        const fetchComments = async () => {
            if (!article || !article.id) return;

            try {
                setLoadingComments(true);
                setErrorComments(null);

                const res = await api.get(`/api/comments?article=${article.id}`);

                setComments(
                    res.data.sort((a: any, b: any) => {
                        const isAUser = a.user.id == 2;
                        const isBUser = b.user.id == 2;
                        if (isAUser && !isBUser) return -1;
                        if (!isAUser && isBUser) return 1;
                        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
                    })
                );
            } catch (err) {
                toast.error("Erreur lors du chargement des commentaires.");
                setErrorArticle("Erreur lors du chargement des commentaires.");
            } finally {
                setLoadingComments(false);
            }
        };

        if (article) fetchComments();
    }, [article]);

    const [newCommentContent, setNewCommentContent] = useState("");
    const [addingComment, setAddingComment] = useState(false);

    const addComment = async () => {
        const content = newCommentContent.trim();
        if (!content || !article?.id) return;

        try {
            setAddingComment(true);

            const res = await api.post("/api/comments", {
                content,
                article: { id: article.id }
            });

            const createdComment = res.data;

            setComments((prev) =>
                [
                    createdComment,
                    ...prev,
                ].sort((a, b) => {
                    const isAUser = a.user.id == 2;
                    const isBUser = b.user.id == 2;
                    if (isAUser && !isBUser) return -1;
                    if (!isAUser && isBUser) return 1;
                    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
                })
            );

            setNewCommentContent("");
            toast.success("Commentaire ajouté !");
        } catch (err) {
            toast.error("Erreur lors de l'ajout du commentaire.");
        } finally {
            setAddingComment(false);
        }
    };

    const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
    const [editingContent, setEditingContent] = useState<string>("");
    const [savingEdit, setSavingEdit] = useState(false);

    const editComment = (comment: any) => {
        if (comment.user.id !== 1) return;
        setEditingCommentId(comment.id);
        setEditingContent(comment.content);
    };

    const cancelEdit = () => {
        setEditingCommentId(null);
        setEditingContent("");
    };

    const saveEdit = async () => {
        if (!editingCommentId) return;

        if (editingContent.trim() == "") {
            setCommentToDelete(editingCommentId);
            setIsDialogOpen(true);
            return;
        }

        try {
            setSavingEdit(true);
            await api.patch(`/api/comments/${editingCommentId}`, {
                content: editingContent,
            });

            toast.success("Commentaire modifié avec succès.");
            setComments((prev) => prev.map((comment) => comment.id == editingCommentId ? { ...comment, content: editingContent, edited_at: new Date().toISOString() } : comment));

            setEditingCommentId(null);
            setEditingContent("");
        } catch (err) {
            toast.error("Erreur lors de la modification.");
        } finally {
            setSavingEdit(false);
        }
    };

    const [commentToDelete, setCommentToDelete] = useState<any | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const deleteComment = async () => {
        if (!commentToDelete) return;

        try {
            setDeleting(true);

            await api.delete(`/api/comments/${commentToDelete}`);

            setComments(prev => prev.filter(c => c.id != commentToDelete));
            toast.success("Commentaire supprimé.");

            setCommentToDelete(null);
            setIsDialogOpen(false);
        } catch (err) {
            toast.error("Erreur lors de la suppression.");
        } finally {
            setDeleting(false);
        }
    };

    return (
        <>
            <Section className="relative px-0 space-y-4 max-w-5xl">
                <ScrollProgressBar type="bar" color="#86919d" strokeSize={2} />

                {errorArticle && (
                    <Alert variant="destructive" className="mb-5 border-destructive/20 bg-destructive/5 text-destructive">
                        <AlertCircleIcon className="h-4 w-4" />
                        <AlertTitle>Une erreur est survenue.</AlertTitle>
                        <AlertDescription>{errorArticle}</AlertDescription>
                    </Alert>
                )}

                {loadingArticle ? (
                    <>
                        <div className="flex flex-wrap justify-between items-center gap-3">
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-6 w-24 rounded-md bg-muted" />  {/* Category */}
                                <Skeleton className="h-5 w-32 bg-muted" /> {/* Date */}
                            </div>

                            <Skeleton className="w-10 h-10 border-4 rounded-full bg-muted" /> {/* Author Picture */}
                        </div>

                        <div className="space-y-2">
                            <Skeleton className="h-8 w-10/12 bg-muted" /> {/* Title */}
                            <Skeleton className="h-5 w-full bg-muted" /> {/* Description */}
                            <Skeleton className="h-5 w-7/12 bg-muted" />
                        </div>

                        <Skeleton className="w-full h-96 rounded-md bg-muted" /> {/* Image */}

                        <div className="space-y-4">
                            <Skeleton className="h-4 w-full bg-muted" /> {/* Content */}
                            <Skeleton className="h-4 w-full bg-muted" />
                            <Skeleton className="h-4 w-11/12 bg-muted" />
                            <Skeleton className="h-4 w-full bg-muted" />
                            <Skeleton className="h-4 w-10/12 bg-muted" />
                            <Skeleton className="h-4 w-full bg-muted" />
                            <Skeleton className="h-4 w-8/12 bg-muted" />
                        </div>
                    </>
                ) : (
                    <>
                        <div className="flex flex-wrap justify-between items-center gap-3">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <CategoryBadge categoryName={article?.category?.name} />
                                <p>{new Date(article?.published_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                            </div>

                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <Avatar className="w-10 h-10 border-4">
                                            <AvatarImage src={`/assets/profile/${article?.user?.picture ?? "Ander.png"}`} />
                                        </Avatar>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>{article?.user?.username}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>

                        <div className="space-y-2">
                            <h1 className="text-2xl text-primary font-bold">{article?.title}</h1>
                            <h2 className="text-md text-primary font-semibold">{article?.description}</h2>
                        </div>

                        <Image width={1468} height={384} src={article?.imageUrl || "/assets/Image.png"} className="w-full max-h-96 rounded-md object-cover" alt="Image de présentation de l'article" />

                        <div dangerouslySetInnerHTML={{ __html: article?.content }} className="max-w-none text-foreground min-h-[200px] focus-visible:outline-none [&_ul]:list-disc [&_ol]:list-decimal [&_ul,&_ol]:pl-6 [&_li]:my-1 [&_blockquote]:border-l-4 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-4 [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mt-4 [&_h1]:mb-2 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-4 [&_h2]:mb-2 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:mt-4 [&_h3]:mb-2 [&_h4]:text-lg [&_h4]:font-semibold [&_h4]:mt-3 [&_h4]:mb-2 [&_h5]:text-md [&_h5]:font-medium [&_h5]:mt-3 [&_h5]:mb-2 [&_h6]:text-base [&_h6]:font-medium [&_h6]:mt-2 [&_h6]:mb-2" />
                    </>
                )}
            </Section>

            <Spacing size="sm" />

            {/* peut-être un tri ? */}
            <Section className="px-0 space-y-4 max-w-5xl">
                <div className="flex justify-between items-center space-x-2">
                    <h3 className="text-xl font-semibold">Commentaires ({comments.length})</h3>
                    <Button size={"sm"} className="ml-auto" onClick={addComment} disabled={addingComment || newCommentContent.trim() == ""}>
                        {addingComment ? (
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
                    <Textarea value={newCommentContent} onChange={(e) => setNewCommentContent(e.target.value)} className="min-h-max" placeholder="Ecrivez un commentaire..." disabled={addingComment} />
                </div>

                {errorComments && (
                    <Alert variant="destructive" className="mb-5 border-destructive/20 bg-destructive/5 text-destructive">
                        <AlertCircleIcon className="h-4 w-4" />
                        <AlertTitle>Une erreur est survenue.</AlertTitle>
                        <AlertDescription>{errorComments}</AlertDescription>
                    </Alert>
                )}

                {loadingComments ? (
                    <>
                        {[1, 2, 3, 4, 5].map((_, i) => (
                            <div key={i} className="flex gap-3 items-start">
                                <Skeleton className="w-10 h-10 border-4 rounded-full bg-muted" />
                                <div className="space-y-1 w-full">
                                    <div className="flex items-center space-x-2">
                                        <Skeleton className="w-36 h-5 bg-muted" />
                                        <Skeleton className="h-5 w-24 bg-muted" />
                                    </div>
                                    <Skeleton className="w-full h-4 bg-muted" />
                                    <Skeleton className="w-11/12 h-4 bg-muted" />
                                </div>
                            </div>
                        ))}
                    </>
                ) : (
                    comments.length === 0 ? (
                        <p className="text-muted-foreground">Aucun commentaire pour le moment. Ecrivez le premier commentaire sur cet article.</p>
                    ) : (
                        comments.map((comment: any) => (
                            <div key={comment.id} className="flex gap-3 items-start">
                                <Avatar className="w-10 h-10 border-4">
                                    <AvatarImage src={`/assets/profile/${comment.user?.picture ?? "Ander.png"}`} />
                                </Avatar>
                                <div className="w-full space-y-1">
                                    <div className="flex justify-between items-center space-x-2">
                                        <div className="flex items-center space-x-2">
                                            <p>{comment.user?.username}</p>
                                            <p className="text-sm text-muted-foreground">{new Date(comment.created_at).toLocaleDateString("fr-FR")}</p>
                                            {comment.edited_at && (<p className="text-xs text-muted-foreground">(modifié)</p>)}
                                        </div>

                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost"><EllipsisVertical className="text-muted-foreground" /></Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                {/* {comment.user.id == session.user.id && ( */}
                                                {comment.user.id == 1 && (
                                                    <>
                                                        <DropdownMenuItem onClick={() => editComment(comment)}>
                                                            <Pencil />
                                                            <span>Modifier</span>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => {
                                                            setCommentToDelete(comment.id);
                                                            setIsDialogOpen(true);
                                                        }}>
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
                                    {editingCommentId == comment.id ? (
                                        <div className="space-y-2">
                                            <Textarea value={editingContent} onChange={(e) => setEditingContent(e.target.value)} className="min-h-max" placeholder="Contenu de votre commentaire..." disabled={savingEdit} />
                                            <div className="flex gap-2">
                                                <Button onClick={() => saveEdit()} size="sm" disabled={savingEdit}>
                                                    {savingEdit ? (
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
                                                <Button variant="outline" onClick={() => cancelEdit()} size="sm" disabled={savingEdit}>Annuler</Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="max-sm:text-sm">{comment.content}</p>
                                    )}
                                </div>
                            </div>
                        ))
                    )
                )}
            </Section>

            <AlertDialog open={isDialogOpen} onOpenChange={(open) => {
                if (!deleting) {
                    setIsDialogOpen(open);
                    if (!open) setCommentToDelete(null);
                }
            }}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Supprimer ce commentaire ?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Cette action est irréversible.
                            Le commentaire sera définitivement supprimé.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={deleting}>Annuler</AlertDialogCancel>
                        <AlertDialogAction className={buttonVariants({ variant: "destructive" })}
                            onClick={async (event) => {
                                event.preventDefault();
                                await deleteComment();
                            }}
                            disabled={deleting}
                        >
                            {deleting ? (
                                <LoaderCircleIcon className="animate-spin h-6 w-6 text-primary-foreground" />
                            ) : null}
                            <span>Supprimer</span>
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
