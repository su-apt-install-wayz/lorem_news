"use client";

import { PropsWithChildren, useState, useTransition } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ChevronDownIcon, LoaderCircleIcon } from "lucide-react";
import { ColorPicker } from "@/components/ui/color-picker";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Props {
    createCategory: (payload: { name: string; color: `#${string}` }) => Promise<{ success: boolean; message?: string }>;
}

export function CreateCategoryDialog({ createCategory, children }: PropsWithChildren<Props>) {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");
    const [color, setColor] = useState<`#${string}`>("#000000");
    const [isPending, startTransition] = useTransition();

    const handleSubmit = () => {
        if (!name.trim()) return toast.error("Le nom est requis.");

        startTransition(async () => {
            const res = await createCategory({ name, color });
            if (res.success) {
                toast.success("Catégorie créée.");
                setName("");
                setColor("#000000");
                setOpen(false);
            } else {
                toast.error(res.message);
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <DialogTrigger asChild>
                            {children}
                        </DialogTrigger>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Créer une catégorie</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>

            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Nouvelle catégorie</DialogTitle>
                    <DialogDescription>Ajouter une nouvelle catégorie à la liste.</DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Nom</Label>
                        <Input id="name" value={name} placeholder="Nom de la catégorie" onChange={(e) => setName(e.target.value)} disabled={isPending} />
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
                        {isPending ? <LoaderCircleIcon className="animate-spin h-6 w-6 text-primary-foreground" /> : "Créer"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
