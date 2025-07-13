"use client";

import { useState, useTransition } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ChevronDownIcon, LoaderCircleIcon } from "lucide-react";
import { Category } from "./CategoriesList";
import { ColorPicker } from "@/components/ui/color-picker";

interface EditCategoryDialogProps {
    category: Category;
    updateCategory: (id: number, payload: { name: string; color: `#${string}` }) => Promise<{ success: boolean; message?: string }>;
    onOptimisticUpdate: (updated: Category) => void;
}

export function EditCategoryDialog({ category, updateCategory, onOptimisticUpdate }: EditCategoryDialogProps) {
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [name, setName] = useState(category.name);
    const [color, setColor] = useState<`#${string}`>(category.color as `#${string}`);

    const handleSubmit = () => {
        startTransition(async () => {
            const optimisticCategory: Category = { ...category, name, color };
            onOptimisticUpdate(optimisticCategory);

            const res = await updateCategory(category.id, { name, color });

            if (res.success) {
                toast.success("Catégorie mise à jour.");
                setOpen(false);
            } else {
                toast.error(res.message);
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
                        <Input id="name" value={name} placeholder="Nom de la catégorie" onChange={(e) => setName(e.target.value)} className="bg-input border-muted" disabled={isPending} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="color">Couleur</Label>
                        <ColorPicker value={color} onValueChange={(value) => setColor(value.hex as `#${string}`)}>
                            <Button variant="outline" className="flex items-center gap-2">
                                <span className="size-3 rounded-full" style={{ backgroundColor: color }} />
                                {color}
                                <ChevronDownIcon size={16} />
                            </Button>
                        </ColorPicker>
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
