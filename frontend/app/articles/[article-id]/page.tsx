"use client";

import { useEffect, useState } from "react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Section } from "@/components/Section";
import { Spacing } from "@/components/Spacing";
import api from "@/lib/api";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";
import CategoryBadge from "@/components/CategoryBadge";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function ArticlePage() {
    const params = useParams();
    const articleId = params["article-id"];

    const [article, setArticle] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchArticle = async () => {
            setLoading(true);
            setError(null);
            if (!articleId) return;

            try {
                const res = await api.get(`/api/articles/slug/${articleId}`);
                setArticle(res.data);
                setLoading(false);
            } catch (err) {
                toast.error("Erreur lors du chargement de l'article.");
                setError("Erreur lors du chargement de l'article.");
            }
        };
        fetchArticle();
    }, [articleId]);

    return (
        <>
            <Header />
            <main className="w-full max-w-[1500px] mx-auto p-4 max-md:p-2">
                <Spacing size="sm" />
                <Section className="px-0 space-y-4 max-w-5xl">
                    {error && (
                        <Alert variant="destructive" className="mb-5 border-destructive/20 bg-destructive/5 text-destructive">
                            <AlertCircleIcon className="h-4 w-4" />
                            <AlertTitle>Une erreur est survenue.</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {loading ? (
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
                <Spacing size="lg" />
            </main>
            <Footer />
        </>
    );
}
