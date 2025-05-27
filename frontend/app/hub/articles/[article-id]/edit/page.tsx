"use client";

import HubLayout from "@/components/hub/hub-layout";
import TextEditor from "@/components/editor/text-editor"
import { Section } from "@/components/Section";
import { Input } from "@/components/ui/input";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircleIcon, EyeIcon, InfoIcon, LoaderCircleIcon, XIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import api from "@/lib/api";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { ImageCard } from "@/components/editor/editor-image-selector";
import { CardDateSelector } from "@/components/editor/editor-publication-date";
import { CardCategorySelector } from "@/components/editor/editor-category";
import { CardTagInput } from "@/components/editor/editor-tags";
import { useParams } from "next/navigation";

const getArticleSchema = (articleId: string) => z.object({
    title: z.string().min(1, "Le titre est requis").max(50, "Le titre ne peut pas dépasser 50 caractères"),
    description: z.string().min(1, "La description est requise").max(100, "La description ne peut pas dépasser 100 caractères"),
    content: z.string().min(1, "Le contenu est requis"),
    image: z.string().nullable().optional(),
    published_at: z.date(),
    category: z.number(),
    tags: z.array(z.string()).optional(),
    status: z.enum(["0", "1"]),
}).superRefine(async (data, ctx) => {
    try {
        const res = await api.get("/api/articles", { params: { title: data.title } });

        const sameTitleButDifferentId = res.data.some(
            (article: any) => String(article.id) !== String(articleId)
        );

        if (sameTitleButDifferentId) {
            ctx.addIssue({
                path: ["title"],
                code: z.ZodIssueCode.custom,
                message: "Ce titre est déjà utilisé.",
            });
        }
    } catch {
        ctx.addIssue({
            path: ["title"],
            code: z.ZodIssueCode.custom,
            message: "Erreur lors de la vérification du titre.",
        });
    }
});

export default function ArticleEditorCreate() {
    const [isTitleAvailable, setIsTitleAvailable] = useState<boolean | null>(null);
    const [titleCheckLoading, setTitleCheckLoading] = useState(false);
    let titleCheckTimeout: ReturnType<typeof setTimeout>;

    const params = useParams();
    const articleId = params["article-id"];
    const articleSchema = getArticleSchema(String(articleId));

    const { register, handleSubmit, control, setValue, watch, formState: { errors, isSubmitting } } = useForm<z.infer<typeof articleSchema>>({
        resolver: zodResolver(articleSchema),
        mode: "onChange",
        defaultValues: {
            title: "",
            description: "",
            content: "",
            image: null,
            published_at: undefined,
            category: 0,
            tags: [],
            status: "0", // si article terminé et publié, on peut le remodifier derrière donc faire attention au status
        },
    });

    const title = watch("title") || "";
    const description = watch("description") || "";

    const onSubmit = async (data: z.infer<typeof articleSchema>) => {
        try {
            const payload = {
                ...data,
                status: data.status ?? "0",
                category: data.category ? { id: data.category } : null
            };

            await api.patch(`/api/articles/${articleId}`, payload);

            toast(
                <div className="flex gap-2">
                    <CheckCircleIcon className="text-green-500 w-5 h-5" />
                    <div className="flex flex-col gap-1">
                        <span>Article enregistré avec succès !</span>
                        <span className="text-muted capitalize">{new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    </div>
                </div>,
                {
                    action: (
                        <Button className="ml-auto cursor-pointer" variant={"ghost"} size={"sm"} onClick={() => toast.dismiss()}>
                            <XIcon />
                        </Button>
                    ),
                }
            );
        } catch (error) {
            toast(
                <div className="flex gap-2">
                    <InfoIcon className="text-red-500 w-5 h-5" />
                    <div className="flex flex-col gap-1">
                        <span>Une erreur est survenue !</span>
                        <span className="text-muted capitalize">{new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    </div>
                </div>,
                {
                    action: (
                        <Button className="ml-auto cursor-pointer" variant={"ghost"} size={"sm"} onClick={() => toast.dismiss()}>
                            <XIcon />
                        </Button>
                    ),
                }
            );
        }
    };

    const checkTitleAvailability = (value: string) => {
        clearTimeout(titleCheckTimeout);

        if (!value || value.length < 3) {
            setIsTitleAvailable(null);
            return;
        }

        setTitleCheckLoading(true);

        titleCheckTimeout = setTimeout(async () => {
            try {
                const res = await api.get("/api/articles", { params: { title: value } });

                if (res.data.length === 0) {
                    setIsTitleAvailable(true);
                } else {
                    // S'il y a un article, mais que c'est celui en cours d'édition, c'est OK
                    const isAvailable = res.data.every((article: any) => article.id == articleId);
                    setIsTitleAvailable(isAvailable);
                }
            } catch {
                setIsTitleAvailable(null);
            } finally {
                setTitleCheckLoading(false);
            }
        }, 500);
    };

    useEffect(() => {
        const fetchArticle = async () => {
            if (!articleId) return;

            try {
                const res = await api.get(`/api/articles/${articleId}`);
                const article = res.data;

                setValue("title", article.title);
                setValue("description", article.description);
                setValue("content", article.content);
                setValue("image", article.image || null);
                setValue("published_at", new Date(article.published_at));
                setValue("category", article.category?.id || 0);
                setValue("tags", article.tags || []);
                setValue("status", article.status.toString());
            } catch (err) {
                toast.error("Erreur lors du chargement de l'article.");
            }
        };

        fetchArticle();
    }, [articleId, setValue]);

    return (
        <HubLayout title="Création d'un article"
            actions={
                <>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant={"ghost"} aria-label="Aperçu"><EyeIcon /></Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Aperçu</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <Button size={"sm"} onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
                        {isSubmitting ? (
                            <>
                                <LoaderCircleIcon className="animate-spin h-6 w-6 text-primary-foreground" />
                                <span>Envoi</span>
                            </>
                        ) :
                            "Enregistrer l'article"
                        }
                    </Button>
                </>
            }
        >
            <Section className="w-full flex gap-4 max-lg:flex-col">
                <Section className="w-full space-y-6 p-0">
                    {/* <div className="space-y-2">
                        <Label htmlFor="article-title" className="ml-1">
                            <span>Titre de l'article</span>
                            <span className="text-muted-foreground text-xs">({title.length}/50)</span>
                        </Label>
                        <Input id="article-title" {...register("title")} placeholder="Titre de l'article" className="bg-card shadow-none" maxLength={50} />
                    </div> */}

                    <div className="space-y-2 relative">
                        <Label htmlFor="article-title" className="ml-1">
                            <span>Titre de l'article</span>
                            <span className="text-muted-foreground text-xs">({title.length}/50)</span>
                        </Label>
                        <div className="relative">
                            <Input id="article-title"
                                {...register("title", {
                                    onChange: (e) => checkTitleAvailability(e.target.value),
                                })}
                                placeholder="Titre de l'article"
                                className="bg-card shadow-none pr-8"
                                maxLength={50}
                            />
                            <div className="absolute right-2 top-1/2 -translate-y-1/2">
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            {titleCheckLoading ? (
                                                <LoaderCircleIcon className="w-4 h-4 animate-spin text-muted-foreground" />
                                            ) : errors.title ? (
                                                <XIcon className="w-4 h-4 text-destructive" />
                                            ) : isTitleAvailable === true ? (
                                                <CheckCircleIcon className="w-4 h-4 text-primary" />
                                            ) : isTitleAvailable === false ? (
                                                <XIcon className="w-4 h-4 text-destructive" />
                                            ) : null}
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            {titleCheckLoading && <span>Vérification en cours...</span>}
                                            {errors.title ? (
                                                <span>{errors.title.message}</span>
                                            ) : isTitleAvailable === true ? (
                                                <span>Titre disponible</span>
                                            ) : isTitleAvailable === false ? (
                                                <span>Titre déjà utilisé</span>
                                            ) : null}
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="article-description" className="ml-1">
                            <span>Description de l'article</span>
                            <span className="text-muted-foreground text-xs">({description.length}/100)</span>
                        </Label>
                        <Input id="article-description" {...register("description")} placeholder="Description de l'article" className="bg-card shadow-none" maxLength={100} />
                    </div>

                    <div className="space-y-2">
                        <div className="flex flex-wrap justify-between space-x-2 space-y-2">
                            <Label className="ml-1">Contenu de l'article</Label>
                            <div className="flex justify-end items-center space-x-2 ml-auto">
                                <Controller
                                    name="status"
                                    control={control}
                                    render={({ field }) => (
                                        <Switch id="article-finished" checked={field.value === "1"} onCheckedChange={(checked: any) => field.onChange(checked ? "1" : "0")} />
                                    )}
                                />

                                <Label htmlFor="article-finished">
                                    <span>Article terminé</span>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger><InfoIcon className="w-3.5 h-3.5 text-primary/50" /></TooltipTrigger>
                                            <TooltipContent>
                                                <p>Cochez si vous avez terminé d'écrire votre article.</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </Label>
                            </div>
                        </div>
                        <Controller control={control} name="content"
                            render={({ field }) => (
                                <TextEditor onContentChange={field.onChange} defaultContent={field.value} />
                            )}
                        />
                    </div>
                </Section>

                <Section className="p-0">
                    <form className="flex flex-col space-y-4">
                        <ImageCard setValue={setValue} />

                        <Controller control={control} name="published_at"
                            render={({ field }) => (
                                <CardDateSelector
                                    value={field.value}
                                    onChange={field.onChange}
                                    clearDate={() => field.onChange(undefined)}
                                    setToday={() => field.onChange(new Date())}
                                    required
                                />
                            )}
                        />

                        <Controller control={control} name="category"
                            render={({ field }) => (
                                <CardCategorySelector value={field.value} onChange={field.onChange} />
                            )}
                        />

                        <Controller control={control} name="tags"
                            render={({ field }) => (
                                <CardTagInput
                                    tags={field.value || []}
                                    onAddTag={(tag) => field.onChange([...(field.value || []), tag])}
                                    onRemoveTag={(tag) => field.onChange((field.value || []).filter((t) => t !== tag))}
                                />
                            )}
                        />
                    </form>
                </Section>
            </Section>
        </HubLayout>
    )
}
