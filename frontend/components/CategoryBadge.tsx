import { Badge } from "@/components/ui/badge";

interface CategoryBadgeProps {
    categoryName: string;
}

export default function CategoryBadge({ categoryName }: CategoryBadgeProps) {

    return (
        <Badge className="rounded-xs capitalize bg-accent text-accent-foreground" variant={"outline"}>
            {categoryName}
        </Badge>
    );
}
