"use client";

import { HubHeader } from "@/components/hub/hub-header";
import { HubContent } from "@/components/hub/hub-content";
import { AlertCircleIcon } from "lucide-react";
import { UsersListLoading } from "@/components/hub/users/UsersList";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function Error() {
    return (
        <>
            <HubHeader title={"Liste des utilisateurs"} />
            
            <HubContent>
                <Alert variant="destructive" className="border-destructive/20 bg-destructive/5 text-destructive">
                    <AlertCircleIcon className="h-4 w-4" />
                    <AlertTitle>Une erreur est survenue.</AlertTitle>
                    <AlertDescription>Impossible de récupérer les utilisateurs. Veuillez réessayer plus tard.</AlertDescription>
                </Alert>

                <UsersListLoading />
            </HubContent>
        </>
    );
}
