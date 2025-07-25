import { HubHeader } from "@/components/hub/hub-header";
import { HubContent } from "@/components/hub/hub-content";
import { Skeleton } from "@/components/ui/skeleton";
import { TeamsListLoading } from "@/components/hub/teams/TeamsList";

export default function Loading() {
    return (
        <>
            <HubHeader title={"Liste des équipes"} actions={<Skeleton className="w-36 h-8 rounded bg-muted" />} />

            <HubContent>
                <TeamsListLoading />
            </HubContent>
        </>
    );
}
