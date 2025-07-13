import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { SelectableLabelCheckbox } from "@/components/hub/SelectableLabelCheckbox";
import { Category } from "./CategoriesList";
import { EditCategoryDialog } from "./EditCategoryDialog";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import Link from "next/link";

interface CategoryCardProps {
    category: Category;
    selected: boolean;
    disabled?: boolean;
    onToggle: (id: number, checked: boolean) => void;
    updateCategory: (id: number, payload: { name: string; color: string }) => Promise<boolean>;
    onOptimisticUpdate: (category: Category) => void;
}

export function CategoryCardSkeleton() {
    return (
        <Card className="p-4 gap-4">
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

export function CategoryCard({ category, selected, disabled, onToggle, updateCategory, onOptimisticUpdate }: CategoryCardProps) {
    function isColorLight(hex: string): boolean {
        if (!hex || hex.length !== 7 || !hex.startsWith("#")) return false;
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        return luminance > 0.7;
    }

    return (
        <Card className="p-4 gap-4">
            <div className="flex justify-between items-center text-muted-foreground">
                <SelectableLabelCheckbox
                    labelUnchecked="Sélectionner"
                    labelChecked="Désélectionner"
                    checked={selected}
                    disabled={disabled}
                    onChange={(checked) => onToggle(category.id, checked)}
                />

                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Link href={`/articles/${encodeURIComponent(category.name.toLowerCase())}`} target="_blank"><Button variant={"ghost"} size={"icon"} className="cursor-pointer"><Eye /></Button></Link>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Voir les articles associés</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>

            <CardHeader className="p-0">
                <Badge style={category.color ? { backgroundColor: category.color } : {}} className={`text-xs px-2 py-0.5 rounded ${category.color ? isColorLight(category.color) ? "text-black" : "text-white" : "bg-muted text-muted-foreground"}`}>
                    {category.color ?? "Aucune couleur"}
                </Badge>

                <CardTitle className="text-base">{category.name}</CardTitle>
            </CardHeader>

            <CardContent className="p-0">
                <p className="text-sm text-muted-foreground">
                    {category.articleCount && category.articleCount > 0
                        ? category.articleCount > 1
                            ? `${category.articleCount} articles associés`
                            : `${category.articleCount} article associé`
                        : "Aucun article associé"}
                </p>
            </CardContent>

            <CardFooter className="p-0">
                <EditCategoryDialog category={category} updateCategory={updateCategory} onOptimisticUpdate={onOptimisticUpdate} />
            </CardFooter>
        </Card>
    );
}
