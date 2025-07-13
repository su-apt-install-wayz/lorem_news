import { HubHeader } from "@/components/hub/hub-header";
import { HubContent } from "@/components/hub/hub-content";
import { UsersListLoading } from "@/components/hub/users/UsersList";

export default function Loading() {
    return (
        <>
            <HubHeader title={"Liste des utilisateurs"} />
            
            <HubContent>
                <UsersListLoading />
            </HubContent>
        </>
    );
}
