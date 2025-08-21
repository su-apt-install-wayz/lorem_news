import { getComments } from "@/app/articles/[article-id]/actions";
import CommentsList from "./CommentsList";


export default async function CommentsSection({ articleId, currentPath }: { articleId: number; currentPath: string }) {
    const comments = await getComments(articleId);
    return (
        <CommentsList initialComments={comments} articleId={articleId} currentPath={currentPath} />
    );
}