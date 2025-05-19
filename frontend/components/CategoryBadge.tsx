import { Badge } from "@/components/ui/badge";

interface CategoryBadgeProps {
    bgColor: string;
    categoryName: string;
}

export default function CategoryBadge({ bgColor, categoryName }: CategoryBadgeProps) {

    return (
        <Badge className="rounded-xs capitalize bg-accent text-accent-foreground" variant={"outline"}>
            {categoryName}
        </Badge>
    );
}
