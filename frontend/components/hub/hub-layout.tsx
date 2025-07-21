"use client";

import { HubSidebar } from "@/components/hub/hub-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { HubHeader } from "./hub-header";

interface HubLayoutProps {
    title: string;
    actions?: React.ReactNode;
    children: React.ReactNode;
}

export default function HubLayout({
    title,
    actions,
    children,
}: HubLayoutProps) {
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
                <HubHeader title={title} actions={actions} />
                <div className="flex flex-1 flex-col">
                    <div className="@container/main flex flex-1 flex-col gap-2">
                        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                            {children}
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
