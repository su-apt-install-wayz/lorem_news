"use client";

import { useState, useTransition } from "react";
import { useSelection } from "@/components/hub/SelectionProviderClient";
import { SelectableLabelCheckbox } from "@/components/hub/SelectableLabelCheckbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { LoaderCircle, Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Team } from "./TeamsList";
import { IconUsersMinus } from "@tabler/icons-react";

export default function TeamsListActions({ teams, deleteSelectedTeams }: { teams: Team[]; deleteSelectedTeams: (ids: number[]) => Promise<number[]>; }) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const { selectedIds, toggleAll, isPageFullySelected, clearSelection } = useSelection();
    const [openAlert, setOpenAlert] = useState(false);
    const [isDeleting, startDelete] = useTransition();
    const [inputValue, setInputValue] = useState(searchParams.get("search") ?? "");
    const [isPending, startTransition] = useTransition();

    const selectableIds = teams.map((t) => t.id);
    const hasSelection = selectedIds.length > 0;

    const handleSearch = (value: string) => {
        setInputValue(value);
        startTransition(() => {
            const params = new URLSearchParams(window.location.search);
            if (value) {
                params.set("search", value);
                params.set("page", "1");
            } else {
                params.delete("search");
            }
            router.push(`?${params.toString()}`);
        });
    };

    const handleDelete = () => {
        startDelete(async () => {
            try {
                const failed = await deleteSelectedTeams(selectedIds);
                if (failed.length === 0) toast.success("Équipes supprimées");
                else toast.error(`Échec pour ${failed.length} équipe(s)`);
                clearSelection();
                setOpenAlert(false);
            } catch (e) {
                toast.error("Erreur lors de la suppression");
                console.error("❌ Suppression échouée :", e);
            }
        });
    };

    return (
        <div className="flex flex-wrap-reverse justify-between items-center gap-4 px-1">
            <div className="flex gap-2 items-center">
                <SelectableLabelCheckbox
                    labelUnchecked="Tout sélectionner"
                    labelChecked="Tout désélectionner"
                    checked={selectableIds.length > 0 && isPageFullySelected(selectableIds)}
                    onChange={() => toggleAll(selectableIds)}
                />

                {hasSelection && (
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button size="sm" variant="link" className="text-xs text-destructive underline-offset-2 cursor-pointer" onClick={clearSelection}>Tout désélectionner</Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Désélection globale</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                )}
            </div>

            <div className="ml-auto flex items-center gap-2">
                <div className="relative">
                    <Input
                        id="search"
                        className="peer ps-9"
                        placeholder="Rechercher..."
                        type="search"
                        value={inputValue}
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                    <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
                        {isPending ? (
                            <LoaderCircle className="animate-spin" size={16} strokeWidth={2} role="status" aria-label="Loading..." />
                        ) : (
                            <Search size={16} strokeWidth={2} aria-hidden="true" />
                        )}
                    </div>
                </div>

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
                                    <IconUsersMinus />
                                    <span className="max-md:hidden ml-2">Supprimer la sélection</span>
                                    {hasSelection ? <span> ({selectedIds.length})</span> : ""}
                                </Button>
                            </span>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{hasSelection ? `Supprimer la sélection (${selectedIds.length})` : "Aucune sélection"}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>

                <AlertDialog open={openAlert} onOpenChange={setOpenAlert}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                            <AlertDialogDescription>
                                {selectedIds.length === 1
                                    ? "Cette action supprimera l’équipe sélectionnée. Voulez-vous continuer ?"
                                    : `Cette action supprimera les ${selectedIds.length} équipes sélectionnées. Voulez-vous continuer ?`}
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
            </div>
        </div>
    );
}