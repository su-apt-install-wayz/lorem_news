"use server";

import { Section } from "@/components/Section";
import { Spacing } from "@/components/Spacing";
import { notFound } from "next/navigation";
import Image from "next/image";
import CategoryBadge from "@/components/CategoryBadge";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import ScrollProgressBar from "@/components/ui/scroll-progress-bar";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { getArticleBySlug } from "./actions";
import { Suspense } from "react";
import CommentsSection from "@/components/articles/CommentsSection";
import { CommentsListLoading } from "@/components/articles/CommentsList";

type PageProps = { params: Promise<{ "article-id": string }> };

export default async function ArticlePage({ params }: PageProps) {
    const { "article-id": slug } = await params;
    const article = await getArticleBySlug(slug);

    if (!article) {
        notFound();
    }

    return (
        <>
            <Header />
            <Spacing size="sm" />
            <main className="w-full max-w-[1500px] mx-auto p-4 max-md:p-2">
                <Section className="relative px-0 space-y-4 max-w-5xl">
                    <ScrollProgressBar type="bar" color="#86919d" strokeSize={2} />

                    <div className="flex flex-wrap justify-between items-center gap-3">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <CategoryBadge categoryName={article?.category?.name ?? "Inconnu"} />
                            <p>{article?.published_at ? new Date(article.published_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : ""}</p>
                        </div>

                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger className="cursor-pointer">
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

                    <Image width={1468} height={384} src={article?.image || "/assets/Image.png"} className="w-full max-h-96 rounded-md object-cover" alt="Image de présentation de l'article" />

                    <div dangerouslySetInnerHTML={{ __html: article?.content ?? "" }} className="max-w-none text-foreground min-h-[200px] focus-visible:outline-none [&_ul]:list-disc [&_ol]:list-decimal [&_ul,&_ol]:pl-6 [&_li]:my-1 [&_blockquote]:border-l-4 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-4 [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mt-4 [&_h1]:mb-2 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-4 [&_h2]:mb-2 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:mt-4 [&_h3]:mb-2 [&_h4]:text-lg [&_h4]:font-semibold [&_h4]:mt-3 [&_h4]:mb-2 [&_h5]:text-md [&_h5]:font-medium [&_h5]:mt-3 [&_h5]:mb-2 [&_h6]:text-base [&_h6]:font-medium [&_h6]:mt-2 [&_h6]:mb-2" />
                </Section>

                <Spacing size="sm" />

                <Section className="px-0 space-y-4 max-w-5xl">
                    <Suspense fallback={<CommentsListLoading />}>
                        <CommentsSection articleId={article.id} currentPath={`/articles/${slug}`} />
                    </Suspense>
                </Section>
            </main >
            <Spacing size="lg" />
            <Footer />
        </>
    );
}
