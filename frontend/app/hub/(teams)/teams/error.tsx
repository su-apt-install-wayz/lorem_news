"use client";

import { HubHeader } from "@/components/hub/hub-header";
import { HubContent } from "@/components/hub/hub-content";
import { AlertCircleIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { TeamsListLoading } from "@/components/hub/teams/TeamsList";

export default function Error() {
    return (
        <>
            <HubHeader title={"Liste des équipes"} actions={<Skeleton className="w-36 h-8 rounded bg-muted" />} />

            <HubContent>
                <Alert variant="destructive" className="border-destructive/20 bg-destructive/5 text-destructive">
                    <AlertCircleIcon className="h-4 w-4" />
                    <AlertTitle>Une erreur est survenue.</AlertTitle>
                    <AlertDescription>Impossible de récupérer les équipes. Veuillez réessayer plus tard.</AlertDescription>
                </Alert>

                <TeamsListLoading />
            </HubContent>
        </>
    );
}
