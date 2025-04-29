import { DataTable } from "@/app/hub/dashboard/data-table-dashbord"
import data from "./data.json"
import { Button } from "@/components/ui/button"
import HubLayout from "@/components/hub/hub-layout"

export default function Page() {
    return (
        <HubLayout title="Mes commandes" actions={<Button size="sm">Nouvelle commande</Button>}>
            <DataTable data={data} />
        </HubLayout>
    )
}
