import { HubHeader } from "@/components/hub/hub-header";
import { HubContent } from "@/components/hub/hub-content";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { UserRoundPlus } from "lucide-react";
import { UsersListLoading } from "@/components/users/UsersList";

export default function Loading() {
    return (
        <>
            <HubHeader title={"Liste des utilisateurs"} actions={
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
            } />
            
            <HubContent>
                <UsersListLoading />
            </HubContent>
        </>
    );
}
