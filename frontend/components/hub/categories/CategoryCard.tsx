import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { SelectableLabelCheckbox } from "@/components/hub/SelectableLabelCheckbox";
import { EditUserDialog } from "@/components/hub/users/EditUserDialog";
import { Category } from "./CategoriesList";
import { EditCategoryDialog } from "./EditCategoryDialog";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface CategoryCardProps {
    category: Category;
    selected: boolean;
    onToggle: (id: number, checked: boolean) => void;
    updateCategory: (id: number, payload: { name: string; color: string }) => Promise<boolean>;
    onOptimisticUpdate: (category: Category) => void;
}

export function CategoryCardSkeleton() {
    return (
        <Card className="p-4">
            <div className="flex justify-between items-center text-muted-foreground">
                <Skeleton className="w-24 h-5 rounded bg-muted" />
                <Skeleton className="w-8 h-8 rounded bg-muted" />
            </div>

            <CardHeader className="p-0">
                <Skeleton className="h-6 w-20 bg-muted" />
                <Skeleton className="h-5 w-6/12 bg-muted" />
            </CardHeader>

            <CardContent className="p-0">
                <Skeleton className="h-4 w-8/12 bg-muted" />
            </CardContent>

            <CardFooter className="p-0">
                <Skeleton className="w-full h-9 rounded bg-muted" />
            </CardFooter>
        </Card>
    );
}

export function CategoryCard({ category, selected, onToggle, updateCategory, onOptimisticUpdate }: CategoryCardProps) {
    function isColorLight(hex: string): boolean {
        const color = hex.replace("#", "");
        const r = parseInt(color.substring(0, 2), 16);
        const g = parseInt(color.substring(2, 4), 16);
        const b = parseInt(color.substring(4, 6), 16);

        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        return luminance > 0.7;
    }

    return (
        <Card className="p-4">
            <div className="flex justify-between items-center text-muted-foreground">
                <SelectableLabelCheckbox
                    labelUnchecked="Sélectionner"
                    labelChecked="Désélectionner"
                    checked={selected}
                    onChange={(checked) => onToggle(category.id, checked)}
                />

                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant={"ghost"} size={"icon"} className="cursor-pointer"><Eye /></Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Voir les articles associés</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>

            <CardHeader className="p-0">
                <Badge style={{ backgroundColor: category.color }} className={`text-xs px-2 py-0.5 rounded ${isColorLight(category.color) ? "text-black" : "text-white"}`}>
                    {category.color}
                </Badge>
                <CardTitle className="text-base">{category.name}</CardTitle>
            </CardHeader>

            <CardContent className="p-0">
                {category.articleCount && (
                    <p className="text-sm text-muted-foreground">{category.articleCount} article{category.articleCount > 1 ? "s" : ""}</p>
                )}
            </CardContent>

            <CardFooter className="p-0">
                <EditCategoryDialog category={category} updateCategory={updateCategory} onOptimisticUpdate={onOptimisticUpdate} />
            </CardFooter>
        </Card>
    );
}
