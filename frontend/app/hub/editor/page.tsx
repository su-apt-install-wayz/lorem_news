"use client";

import { HubSidebar } from "@/components/hub/hub-sidebar"
import { SiteHeader } from "@/components/hub/site-header"
import TextEditor from "@/components/hub/text-editor"
import { Section } from "@/components/Section";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { useState } from "react";

export default function ArticleEditor() {
    const [editorInstance, setEditorInstance] = useState<any>(null);

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
                <SiteHeader title="Création d'un article" />
                <div className="flex flex-1 flex-col">
                    <div className="@container/main flex flex-1 flex-col gap-2">
                        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                            <Section className="w-full">
                                <TextEditor setEditorInstance={setEditorInstance} />
                            </Section>
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
