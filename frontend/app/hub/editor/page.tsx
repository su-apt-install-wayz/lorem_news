"use client";

import HubLayout from "@/components/hub/hub-layout";
import TextEditor from "@/components/hub/text-editor"
import { Section } from "@/components/Section";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { AlertCircleIcon, BadgePlusIcon, CalendarIcon, LoaderCircleIcon, TagIcon, XIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { ImageDropzone } from "@/components/image-dropzone";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import api from "@/lib/api";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { TextShimmer } from "@/components/motion-primitives/text-shimmer";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

interface Category {
    id: string;
    name: string;
}

export default function ArticleEditor() {
    const [editorInstance, setEditorInstance] = useState<any>(null);

    const [categories, setCategories] = useState<Category[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const [date, setDate] = React.useState<Date>();

    const [tags, setTags] = useState<string[]>([]);
    const [tagInputValue, setTagInputValue] = useState("");

    const handleAddTag = () => {
        const trimmedValue = tagInputValue.trim();
        if (trimmedValue && !tags.includes(trimmedValue)) {
            setTags([...tags, trimmedValue]);
            setTagInputValue("");
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setTags(tags.filter((tag) => tag !== tagToRemove));
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleAddTag();
        }
    };

    useEffect(() => {
        const fetchCategories = async () => {
            setLoading(true);
            setError(null);
            try {
                // const response = await api.get("/api/categories");
                // setCategories(response.data);

                await new Promise((resolve) => setTimeout(resolve, 5000));

                // Liste FAKE
                const fakeCategories = [
                    { id: "tech", name: "Technologie" },
                    { id: "news", name: "Actualités" },
                    { id: "lifestyle", name: "Lifestyle" },
                    { id: "gaming", name: "Gaming" },
                    { id: "music", name: "Musique" },
                ];

                setCategories(fakeCategories);
            } catch (err) {
                setError("Impossible de récupérer les catégories. Veuillez réessayer plus tard.");
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    return (
        <HubLayout title="Création d'un article">
            <Section className="w-full flex gap-4">
                <Section className="w-full space-y-6 p-0">
                    <div className="space-y-2">
                        <Label htmlFor="article-title" className="ml-1">Titre de l'article</Label>
                        <Input id="article-title" placeholder="Titre de l'article" className="bg-card shadow-none" />
                    </div>
                    <div className="space-y-2">
                        <Label className="ml-1">Contenu de l'article</Label>
                        <TextEditor setEditorInstance={setEditorInstance} />
                        <div className="flex justify-end items-center space-x-2">
                            <Switch id="article-finished" />
                            <Label htmlFor="article-finished">Article terminé</Label>
                        </div>
                    </div>
                    <div className="flex justify-end items-center">
                        <Button>Enregistrer l'article</Button>
                    </div>
                </Section>

                <Separator orientation="vertical" className="h-full" />

                <Section className="p-0">
                    <form className="space-y-4">
                        <Card className="w-[350px] rounded-md shadow-none">
                            <CardHeader>
                                <CardTitle>Image de l'article</CardTitle>
                                <CardDescription>Sélectionnez une image de présentation.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ImageDropzone />
                            </CardContent>
                        </Card>

                        <Separator orientation="horizontal" />

                        <Card className="w-[350px] rounded-md shadow-none">
                            <CardHeader>
                                <CardTitle>Date de publication</CardTitle>
                                <CardDescription>Sélectionnez une date de publication de l'article.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant={"outline"}
                                            className={cn(
                                                "w-full justify-start text-left font-normal",
                                                !date && "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {date ? format(date, "PPP", { locale: fr }) : <span>Date de publication</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar mode="single" selected={date} onSelect={setDate} initialFocus locale={fr} />
                                        <div className="flex justify-between items-center p-2">
                                            <Button variant={"ghost"} onClick={() => setDate(undefined)} className="text-destructive">Effacer</Button>
                                            <Button variant={"ghost"} onClick={() => setDate(new Date())} className="text-secondary">Aujourd'hui</Button>
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            </CardContent>
                        </Card>

                        <Separator orientation="horizontal" />

                        <Card className="w-[350px] rounded-md shadow-none">
                            <CardHeader>
                                <CardTitle>Catégorie de l'article</CardTitle>
                                <CardDescription>Sélectionnez la catégorie de l'article.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {error ? (
                                    <Alert variant="destructive" className="border-destructive/20 bg-destructive/5 text-destructive">
                                        <AlertCircleIcon className="h-4 w-4" />
                                        <div className="flex flex-col gap-1">
                                            <AlertTitle>Une erreur est survenue.</AlertTitle>
                                            <AlertDescription className="text-destructive">{error}</AlertDescription>
                                        </div>
                                    </Alert>
                                ) : loading ? (
                                    <div className="flex items-center space-x-2">
                                        <LoaderCircleIcon className="animate-spin h-5 w-5 text-muted" />
                                        <TextShimmer className="text-sm" duration={2}>Récupération des catégories...</TextShimmer>
                                    </div>
                                ) : (
                                    <RadioGroup className="w-full flex flex-wrap gap-3">
                                        {categories.map((category) => (
                                            <div key={category.id} className="flex items-center space-x-2">
                                                <RadioGroupItem value={category.id} id={category.id} />
                                                <Label htmlFor={category.id}>{category.name}</Label>
                                            </div>
                                        ))}
                                    </RadioGroup>
                                )}
                            </CardContent>

                        </Card>

                        <Separator orientation="horizontal" />

                        <Card className="w-[350px] rounded-md shadow-none">
                            <CardHeader>
                                <CardTitle>Tags de l'article</CardTitle>
                                <CardDescription>Ajoutez des tags à l'article.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex gap-2 items-center">
                                        <Input placeholder="Ajouter un tag..." value={tagInputValue} onChange={(e) => setTagInputValue(e.target.value)} onKeyDown={handleKeyDown} />
                                        <Button size={"sm"} type="button" onClick={handleAddTag}><BadgePlusIcon /></Button>
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        {tags.map((tag) => (
                                            <Badge key={tag} variant="outline" className="flex items-center gap-2 border-muted p-2 py-1">
                                                <TagIcon />
                                                {tag}
                                                <Button variant={"ghost"} onClick={() => handleRemoveTag(tag)} className="p-2 h-6 w-6 hover:text-destructive">
                                                    <XIcon className="h-3 w-3" />
                                                </Button>
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </form>
                </Section>
            </Section>
        </HubLayout>
    )
}
