"use client";

import React, { useState } from "react";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Spacing } from "@/components/Spacing";
import { cn } from "@/lib/utils";
import ArticleCard, { ArticleCardSkeleton } from "@/components/articles/ArticleCard";

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
                        <ArticleCardSkeleton key={index} />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className={cn("default-classes", className)}>
            <div className="grid w-full grid-cols-[repeat(auto-fill,minmax(290px,1fr))] justify-center gap-4">
                {currentArticles.map((article) => (
                    <ArticleCard key={article.id} article={article} />
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
                                <PaginationItem key={index}>
                                    <PaginationLink href="#" onClick={() => paginate(index + 1)} isActive={currentPage === index + 1}>
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
