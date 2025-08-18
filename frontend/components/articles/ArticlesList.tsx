import { Spacing } from "@/components/Spacing";
import { cn } from "@/lib/utils";
import ArticleCard, { ArticleCardSkeleton } from "@/components/articles/ArticleCard";
import PaginationClient from "@/components/hub/PaginationClient";

export interface Article {
    id: number;
    title: string;
    description: string;
    content: string;
    slug: string;
    image: string;
    published_at: string;
    user: { username: string; picture: string };
    category: { id: number; name: string; color: string };
    tags: string;
}

export default function ArticlesList({ articles, currentPage, totalPages, className }: { articles: Article[]; currentPage: number; totalPages: number; className?: string; }) {
    return (
        <div className={cn("space-y-2", className)}>
            <ul className="grid grid-cols-[repeat(auto-fill,minmax(290px,1fr))] gap-4">
                {articles.map((a) => (
                    <li key={a.id}>
                        <ArticleCard article={a} />
                    </li>
                ))}
            </ul>

            <Spacing size="xs" />

            {totalPages > 1 && (
                <PaginationClient currentPage={currentPage} totalPages={totalPages} />
            )}
        </div>
    );
}

export function ArticlesListLoading(props: { className?: string; }) {
    const articlesPerPage = 12;
    return (
        <div className={cn("space-y-2", props.className)}>
            <div className="grid w-full grid-cols-[repeat(auto-fill,minmax(290px,1fr))] gap-4">
                {Array.from({ length: articlesPerPage }).map((_, i) => (
                    <ArticleCardSkeleton key={i} />
                ))}
            </div>
        </div>
    );
}
