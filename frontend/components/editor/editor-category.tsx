import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { LoaderCircleIcon, RotateCcwIcon, AlertCircleIcon } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { TextShimmer } from "@/components/motion-primitives/text-shimmer";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import CategoryBadge from "@/components/CategoryBadge";
import { Label } from "../ui/label";

interface Category {
    id: number;
    name: string;
    color: string;
}

interface CardCategorySelectorProps {
    value: number;
    onChange: (val: number) => void;
}

export function CardCategorySelector({ value, onChange }: CardCategorySelectorProps) {
    const [loading, setLoading] = useState<boolean>(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [error, setError] = useState<string | null>(null);

    const fetchCategories = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get("/api/categories");
            setCategories(response.data);
        } catch {
            setError("Impossible de récupérer les catégories. Veuillez réessayer plus tard.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    return (
        <Card className="w-full rounded-md shadow-none">
            <CardHeader>
                <CardTitle className="flex justify-between items-center">
                    <span>Catégorie de l&apos;article</span>
                    {!loading && (
                        <Button size={"sm"} variant={"ghost"} onClick={fetchCategories}><RotateCcwIcon /></Button>
                    )}
                </CardTitle>
                <CardDescription>Sélectionnez la catégorie de l&apos;article.</CardDescription>
            </CardHeader>
            <CardContent>
                {error ? (
                    <Alert variant="destructive" className="border-destructive/20 bg-destructive/5 text-destructive">
                        <AlertCircleIcon className="h-4 w-4" />
                        <div className="flex flex-col gap-1">
                            <AlertTitle>Une erreur est survenue.</AlertTitle>
                            <AlertDescription className="text-destructive">{error}</AlertDescription>
                        </div>
                    </Alert>
                ) : loading ? (
                    <div className="flex items-center space-x-2">
                        <LoaderCircleIcon className="animate-spin h-5 w-5 text-muted" />
                        <TextShimmer className="text-sm" duration={2}>Récupération des catégories...</TextShimmer>
                    </div>
                ) : (
                    // <RadioGroup value={value.toString()} onValueChange={(val) => onChange(parseInt(val))} className="w-full flex flex-wrap gap-3">
                    //     {categories.map((category) => (
                    //         <div key={category.id} className="flex items-center space-x-2">
                    //             <RadioGroupItem value={category.id.toString()} id={`category-${category.id}`} />
                    //             <Label htmlFor={`category-${category.id}`}>{category.name}</Label>
                    //         </div>
                    //     ))}
                    // </RadioGroup>
                    <RadioGroup
                        value={value.toString()}
                        onValueChange={(val) => onChange(parseInt(val))}
                        className="w-full flex flex-wrap gap-3"
                    >
                        {categories.map((category) => {
                            const selected = category.id === value;

                            return (
                                <Label key={category.id} htmlFor={`category-${category.id}`}className={`cursor-pointer transition-all rounded-xs ${selected ? "outline outline-2 outline-muted outline-offset-3" : "outline-0"}`}>
                                    <RadioGroupItem
                                        value={category.id.toString()}
                                        id={`category-${category.id}`}
                                        className="sr-only"
                                    />
                                    <CategoryBadge categoryName={category.name} />
                                </Label>
                            );
                        })}
                    </RadioGroup>
                )}
            </CardContent>
        </Card>
    );
}
