import { HubSidebar } from "@/components/hub/hub-sidebar"
import { DataTable } from "@/components/hub/data-table"
import { SiteHeader } from "@/components/hub/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

import data from "./data.json"
import { Button } from "@/components/ui/button"

export default function Page() {
    return (
        <SidebarProvider
            style={
                {
                    "--sidebar-width": "calc(var(--spacing) * 72)",
                    "--header-height": "calc(var(--spacing) * 12)",
                } as React.CSSProperties
            }
        >
            <HubSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader
                    title="Mes commandes"
                    actions={
                        <>
                            <Button size="sm">Nouvelle commande</Button>
                        </>
                    }
                />
                <div className="flex flex-1 flex-col">
                    <div className="@container/main flex flex-1 flex-col gap-2">
                        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                            <DataTable data={data} />
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
