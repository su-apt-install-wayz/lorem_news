"use client";

import { SelectableLabelCheckbox } from "../SelectableLabelCheckbox";
import { useSelection } from "../SelectionProviderClient";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { User } from "./UsersList";
import { useState, useTransition } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../ui/tooltip";
import { Filter, UserRoundX } from "lucide-react";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../../ui/alert-dialog";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "../../ui/sheet";
import { useSession } from "next-auth/react";

export default function UsersListActions({ users, deleteSelectedUsers }: { users: User[]; deleteSelectedUsers: (ids: number[]) => Promise<number[]>; }) {
    const { data: session } = useSession();
    // const currentUserId = session?.user?.id;
    const currentUserId = 1;

    const { selectedIds, toggleAll, isPageFullySelected, clearSelection } = useSelection();
    const [openAlert, setOpenAlert] = useState(false);
    const [isDeleting, startDelete] = useTransition();

    const selectableIds = users
        .map((u) => u.id)
        .filter((id) => id !== currentUserId);

    const filteredSelectedIds = selectedIds.filter((id) => id !== currentUserId);
    const hasSelection = filteredSelectedIds.length > 0;

    const adminIds = users
        .filter((u) => filteredSelectedIds.includes(u.id) && u.roles.includes("ROLE_ADMIN"))
        .map((u) => u.id);

    const hasAdminSelected = adminIds.length > 0;
    const [confirmInput, setConfirmInput] = useState("");

    const canDelete = !isDeleting && (!hasAdminSelected || confirmInput === "SUPPRIMER");

    const handleDelete = () => {
        startDelete(async () => {
            try {
                const failed = await deleteSelectedUsers(filteredSelectedIds);

                if (failed.length === 0) {
                    toast.success("Utilisateurs supprimés");
                } else {
                    toast.error(`Échec pour ${failed.length} utilisateur(s)`);
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
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <span className={hasSelection ? "" : "cursor-not-allowed opacity-50"}>
                                <Button size="sm" variant="destructive" disabled={!hasSelection} onClick={() => setOpenAlert(true)}>
                                    <UserRoundX />
                                    <span className="max-md:hidden ml-2">Supprimer la sélection</span>
                                    {hasSelection ? <span>{" "}({selectedIds.length})</span> : ""}
                                </Button>
                            </span>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{hasSelection ? `Supprimer la sélection (${selectedIds.length})` : "Aucun utilisateur sélectionné"}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>

                <AlertDialog open={openAlert}
                    onOpenChange={(open) => {
                        setOpenAlert(open);
                        if (!open) setConfirmInput("");
                    }}
                >
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                            <AlertDialogDescription>
                                {filteredSelectedIds.length === 1
                                    ? "Cette action supprimera l'utilisateur sélectionné. Voulez-vous continuer ?"
                                    : `Cette action supprimera les ${filteredSelectedIds.length} utilisateurs sélectionnés. Voulez-vous continuer ?`}
                            </AlertDialogDescription>

                            {hasAdminSelected && (
                                <div className="mt-4 space-y-2">
                                    <p className="text-sm text-destructive font-semibold">
                                        <span>⚠️</span>
                                        {" "}
                                        {adminIds.length === 1
                                            ? "Attention : vous avez sélectionné un administrateur."
                                            : "Attention : vous avez sélectionné plusieurs administrateurs."
                                        }
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        Pour confirmer cette suppression, tapez <span className="font-mono font-bold">SUPPRIMER</span> ci-dessous.
                                    </p>
                                    <input
                                        type="text"
                                        value={confirmInput}
                                        onChange={(e) => setConfirmInput(e.target.value)}
                                        placeholder="SUPPRIMER"
                                        className="w-full px-3 py-2 border rounded text-sm border-muted bg-input"
                                        disabled={isDeleting}
                                    />
                                </div>
                            )}
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel disabled={isDeleting}>Annuler</AlertDialogCancel>
                            <Button onClick={handleDelete} disabled={isDeleting || !canDelete}>
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
                            {/* Contenu des filtres à insérer ici */}
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </div>
    );
}
