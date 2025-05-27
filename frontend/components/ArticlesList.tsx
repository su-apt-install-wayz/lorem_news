"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Spacing } from "@/components/Spacing";
import CategoryBadge from "./CategoryBadge";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

export interface Article {
    id: number;
    title: string;
    description: string;
    content: string;
    slug: string;
    image: string;
    published_at: string;
    user: {
        username: string;
        picture: string;
    };
    category: {
        id: number;
        name: string;
        color: string;
    };
    tags: string;
}

interface ArticlesListProps {
    articles: Article[];
    className?: string;
    filters?: { category: string; sortBy: string };
    loading?: boolean;
    articlesPerPage?: number;
}

const ArticlesList: React.FC<ArticlesListProps> = ({ articles, className, filters = { category: "all", sortBy: "recent" }, loading = false, articlesPerPage = 12 }) => {
    const [currentPage, setCurrentPage] = useState<number>(1);

    const filteredArticles = articles.filter(article =>
        filters.category === "all" || article.category.name === filters.category
    );

    const sortedArticles = [...filteredArticles].sort((a, b) => {
        if (filters.sortBy === "recent") {
            return new Date(b.published_at).getTime() - new Date(a.published_at).getTime();
        }
        return 0;
    });

    const totalPages = Math.ceil(sortedArticles.length / articlesPerPage);
    const indexOfLastArticle = currentPage * articlesPerPage;
    const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
    const currentArticles = sortedArticles.slice(indexOfFirstArticle, indexOfLastArticle);

    const paginate = (pageNumber: number) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    if (loading) {
        return (
            <div className={cn("default-classes", className)}>
                <div className="grid w-full grid-cols-[repeat(auto-fill,minmax(290px,1fr))] justify-center gap-4">
                    {Array.from({ length: articlesPerPage }).map((_, index) => (
                        <Card key={index} className="p-0 rounded-md gap-1 overflow-hidden shadow-none">
                            <Skeleton className="w-full h-62 rounded-none bg-muted" />

                            <div className="mt-3 px-3">
                                <Skeleton className="h-4 w-24 bg-muted" />
                            </div>

                            <CardHeader className="mt-4 px-3">
                                <Skeleton className="h-6 w-2/3 bg-muted" />
                            </CardHeader>

                            <CardContent className="mt-2 px-3 mb-6">
                                <Skeleton className="h-4 w-full mb-1 bg-muted" />
                                <Skeleton className="h-4 w-5/6 bg-muted" />
                            </CardContent>

                            <CardFooter className="mt-auto flex justify-between items-end px-3 pb-3">
                                <div className="flex items-center gap-2">
                                    <Skeleton className="w-7 h-7 rounded-full bg-muted" />
                                    <Skeleton className="h-4 w-28 bg-muted" />
                                </div>
                                <Skeleton className="h-3 w-20 bg-muted" />
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className={cn("default-classes", className)}>
            <div className="grid w-full grid-cols-[repeat(auto-fill,minmax(290px,1fr))] justify-center gap-4">
                {currentArticles.map((article, index) => (
                    <Card key={index} className="relative p-0 rounded-md gap-1 overflow-hidden shadow-none">
                        <img className="w-full h-auto object-cover" src={article?.image ?? "/assets/Image.png"} alt="" />

                        <div className="mt-3 px-3">
                            {article?.category && (<CategoryBadge categoryName={article.category.name} />)}
                        </div>

                        <CardHeader className="mt-4 px-3">
                            <CardTitle className="hover:underline"><Link href={`/articles/${article.slug}`}>{article.title}</Link></CardTitle>
                        </CardHeader>

                        <CardContent className="px-3 mb-6">
                            <CardDescription>{article?.description}</CardDescription>
                        </CardContent>

                        <CardFooter className="mt-auto flex justify-between items-end px-3 pb-3">
                            <div className="flex items-center gap-2">
                                <Avatar className="w-7 h-7">
                                    <AvatarImage src={`/assets/profile/${article?.user?.picture ?? "Ander.png"}`} />
                                </Avatar>
                                <span className="text-sm">{article?.user?.username}</span>
                            </div>
                            <span className="text-xs text-muted-foreground capitalize">{new Date(article?.published_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                        </CardFooter>
                    </Card>
                ))}
            </div>
            {filteredArticles.length > articlesPerPage && (
                <>
                    <Spacing size="sm" />
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    href="#"
                                    onClick={() => paginate(currentPage - 1)}
                                    className={currentPage === 1 ? "opacity-50 pointer-events-none" : ""}
                                />
                            </PaginationItem>
                            {Array.from({ length: totalPages }).map((_, index) => (
                                <PaginationItem key={index} className={currentPage === index + 1 ? "bg-primary text-white rounded" : ""}>
                                    <PaginationLink href="#" onClick={() => paginate(index + 1)}>
                                        {index + 1}
                                    </PaginationLink>
                                </PaginationItem>
                            ))}
                            <PaginationItem>
                                <PaginationNext
                                    href="#"
                                    onClick={() => paginate(currentPage + 1)}
                                    className={currentPage === totalPages ? "opacity-50 pointer-events-none" : ""}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </>
            )}
        </div>
    );
};

export default ArticlesList;
