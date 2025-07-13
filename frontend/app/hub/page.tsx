import { HubHeader } from "@/components/hub/hub-header";
import { HubContent } from "@/components/hub/hub-content";

export default async function HubPage() {
    return (
        <>
            <HubHeader title={"Dashboard"} />

            <HubContent>
                Hub
            </HubContent>
        </>
    );
}
