"use client";

import { HubHeader } from "@/components/hub/hub-header";
import { HubContent } from "@/components/hub/hub-content";
import { AlertCircleIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CategoriesListLoading } from "@/components/hub/categories/CategoriesList";
import { Skeleton } from "@/components/ui/skeleton";

export default function Error() {
    return (
        <>
            <HubHeader title={"Liste des catégories"} actions={<Skeleton className="w-40 h-8 rounded bg-muted" />}  />

            <HubContent>
                <Alert variant="destructive" className="border-destructive/20 bg-destructive/5 text-destructive">
                    <AlertCircleIcon className="h-4 w-4" />
                    <AlertTitle>Une erreur est survenue.</AlertTitle>
                    <AlertDescription>Impossible de récupérer les catégories. Veuillez réessayer plus tard.</AlertDescription>
                </Alert>

                <CategoriesListLoading />
            </HubContent>
        </>
    );
}
