"use client";

import { useState, useTransition } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { LoaderCircleIcon } from "lucide-react";
import { Category } from "./CategoriesList";

interface EditCategoryDialogProps {
    category: Category;
    updateCategory: (id: number, payload: { name: string; color: string; }) => Promise<boolean>;
    onOptimisticUpdate: (updated: Category) => void;
}

export function EditCategoryDialog({ category, updateCategory, onOptimisticUpdate }: EditCategoryDialogProps) {
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [name, setName] = useState(category.name);
    const [color, setColor] = useState(category.color);

    const handleSubmit = () => {
        startTransition(async () => {
            const optimisticCategory: Category = { ...category, name, color };
            onOptimisticUpdate(optimisticCategory);

            const success = await updateCategory(category.id, { name, color });

            if (success) {
                toast.success("Catégorie mise à jour.");
                setOpen(false);
            } else {
                toast.error("Erreur lors de la mise à jour.");
            }
        });

    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="w-full cursor-pointer">Modifier</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Modifier la catégorie</DialogTitle>
                    <DialogDescription>
                        Mettez à jour les informations de la catégorie <span className="font-semibold">{category.name}</span>.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Nom</Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="bg-input border-muted"
                            disabled={isPending}
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="color">Couleur</Label>
                        <Input
                            id="color"
                            value={color}
                            onChange={(e) => setColor(e.target.value)}
                            className="bg-input border-muted"
                            disabled={isPending}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Annuler</Button>
                    </DialogClose>
                    <Button onClick={handleSubmit} disabled={isPending}>
                        {isPending ? <LoaderCircleIcon className="animate-spin h-6 w-6 text-primary-foreground" /> : "Sauvegarder"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
