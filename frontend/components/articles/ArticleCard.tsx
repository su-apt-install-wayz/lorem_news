import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import CategoryBadge from "@/components/CategoryBadge";
import { Article } from "@/components/articles/ArticlesList";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";

interface ArticleCardProps {
    article: Article;
}

export function ArticleCardSkeleton() {
    return (
        <Card className="p-0 rounded-md gap-1 overflow-hidden shadow-none">
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
    );
}

export default function ArticleCard({ article }: ArticleCardProps) {
    return (
        <Card className="relative p-0 rounded-md gap-1 overflow-hidden shadow-none">
            <Image width={350} height={248} className="w-full h-auto object-cover" src={article?.image ?? "/assets/Image.png"} alt="" />

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
    );
}