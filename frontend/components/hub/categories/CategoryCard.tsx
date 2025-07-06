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
            <div className="flex items-center text-muted-foreground">
                <Skeleton className="w-24 h-4 rounded bg-muted" />
            </div>

            <div className="flex justify-center">
                <Skeleton className="w-15 h-15 rounded-full bg-muted" />
            </div>

            <CardHeader className="text-center p-0">
                <Skeleton className="h-6 w-6/12 mx-auto bg-muted" />
                <Skeleton className="h-5 w-7/12 mx-auto bg-muted" />
            </CardHeader>

            <CardContent className="flex justify-center flex-wrap gap-2">
                <Skeleton className="h-6 w-24 rounded-full bg-muted" />
            </CardContent>

            <CardFooter className="p-0">
                <Skeleton className="w-full h-9 rounded bg-muted" />
            </CardFooter>
        </Card>
    );
}

export function CategoryCard({ category, selected, onToggle, updateCategory, onOptimisticUpdate }: CategoryCardProps) {
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
                <Badge style={{ backgroundColor: category.color }} className="text-xs px-2 py-0.5 rounded">{category.color}</Badge>
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
