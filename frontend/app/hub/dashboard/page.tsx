import { DataTable } from "@/app/hub/dashboard/data-table-dashbord"
import data from "./data.json"
import { Button } from "@/components/ui/button"
import HubLayout from "@/components/hub/hub-layout"

export default function Page() {
    return (
        <HubLayout title="Hub Test" actions={<Button size="sm">Test</Button>}>
            <DataTable data={data} />
        </HubLayout>
    )
}
