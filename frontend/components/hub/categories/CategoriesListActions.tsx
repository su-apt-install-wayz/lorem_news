"use client";

import { SelectableLabelCheckbox } from "../SelectableLabelCheckbox";
import { useSelection } from "../SelectionProviderClient";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState, useTransition } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Category } from "./CategoriesList";
import { Filter, FolderMinus } from "lucide-react";

export default function CategoriesListActions({ categories, deleteSelectedCategories }: { categories: Category[]; deleteSelectedCategories: (ids: number[]) => Promise<number[]>; }) {
    const { selectedIds, toggleAll, isPageFullySelected, clearSelection } = useSelection();
    const [openAlert, setOpenAlert] = useState(false);
    const [isDeleting, startDelete] = useTransition();

    const selectableIds = categories.map((c) => c.id);
    const hasSelection = selectedIds.some((id) => selectableIds.includes(id));

    const handleDelete = () => {
        startDelete(async () => {
            try {
                const failed = await deleteSelectedCategories(selectedIds);

                if (failed.length === 0) {
                    toast.success("Catégories supprimées");
                } else {
                    toast.error(`Échec pour ${failed.length} catégorie(s)`);
                }

                clearSelection();
                setOpenAlert(false);
            } catch (e) {
                toast.error("Erreur lors de la suppression");
                console.error("❌ Suppression échouée :", e);
            }
        });
    };

    return (
        <div className="flex justify-between items-center gap-4 px-1">
            <SelectableLabelCheckbox
                labelUnchecked="Tout sélectionner"
                labelChecked="Tout désélectionner"
                checked={isPageFullySelected(selectableIds)}
                onChange={() => toggleAll(selectableIds)}
            />

            <div className="flex items-center gap-2">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <span className={hasSelection ? "" : "cursor-not-allowed opacity-50"}>
                                <Button
                                    size="sm"
                                    variant="destructive"
                                    disabled={!hasSelection}
                                    onClick={() => setOpenAlert(true)}
                                >
                                    <FolderMinus />
                                    <span className="max-md:hidden ml-2">Supprimer la sélection</span>
                                    {hasSelection ? <span> ({selectedIds.length})</span> : ""}
                                </Button>
                            </span>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>
                                {hasSelection
                                    ? `Supprimer la sélection (${selectedIds.length})`
                                    : "Aucune catégorie sélectionnée"}
                            </p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>

                <AlertDialog
                    open={openAlert}
                    onOpenChange={(open) => setOpenAlert(open)}
                >
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                            <AlertDialogDescription>
                                {selectedIds.length === 1
                                    ? "Cette action supprimera la catégorie sélectionnée. Voulez-vous continuer ?"
                                    : `Cette action supprimera les ${selectedIds.length} catégories sélectionnées. Voulez-vous continuer ?`}
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel disabled={isDeleting}>Annuler</AlertDialogCancel>
                            <Button onClick={handleDelete} disabled={isDeleting}>
                                {isDeleting ? (
                                    <span className="animate-spin w-4 h-4 border-2 border-t-transparent rounded-full" />
                                ) : (
                                    "Confirmer"
                                )}
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" className="flex items-center gap-2 cursor-pointer">
                            <Filter />
                            <span>Filtrer</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent className="z-99">
                        <SheetHeader>
                            <SheetTitle>Filtres</SheetTitle>
                            <SheetDescription>Affinez votre recherche en appliquant des filtres.</SheetDescription>
                        </SheetHeader>
                        <div className="flex flex-col gap-3 px-2">
                            {/* Ajouter les filtres ici */}
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </div>
    );
}
