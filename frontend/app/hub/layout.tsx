import { HubSidebar } from "@/components/hub/hub-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { PropsWithChildren } from "react";


export default function Layout(props: PropsWithChildren) {
    return (
        <SidebarProvider
            style={
                {
                    "--sidebar-width": "calc(var(--spacing) * 72)",
                    "--header-height": "calc(var(--spacing) * 12)",
                } as React.CSSProperties
            }
        >
            <HubSidebar />
            <SidebarInset>
                {props.children}
            </SidebarInset>
        </SidebarProvider>
    );
}
