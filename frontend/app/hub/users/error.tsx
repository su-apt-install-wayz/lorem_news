"use client";

import { HubHeader } from "@/components/hub/hub-header";
import { HubContent } from "@/components/hub/hub-content";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AlertCircleIcon, UserRoundPlus, UserRoundX } from "lucide-react";
import UsersList from "@/components/users/UsersList";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function Error() {
    return (
        <>
            <HubHeader title={"Liste des utilisateurs"} actions={
                <>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button size={"sm"}><span><UserRoundPlus /></span><span className="max-md:hidden">Créer utilisateur</span></Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Créer un utilisateur</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button size={"sm"} variant={"destructive"}><span><UserRoundX /></span><span className="max-md:hidden">Supprimer sélection</span></Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Supprimer la sélection</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </>
            } />
            <HubContent>
                <Alert variant="destructive" className="border-destructive/20 bg-destructive/5 text-destructive">
                    <AlertCircleIcon className="h-4 w-4" />
                    <AlertTitle>Une erreur est survenue.</AlertTitle>
                    <AlertDescription>Impossible de récupérer les utilisateurs. Veuillez réessayer plus tard.</AlertDescription>
                </Alert>

                <UsersList users={[]} loading={true} usersPerPage={8} />
            </HubContent>
        </>
    );
}
