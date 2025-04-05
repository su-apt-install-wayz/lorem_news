"use client"

import * as React from "react"
import { IconChartBubbleFilled, IconDashboard, IconFolder, IconHelp, IconSearch, IconSettings, IconUsers } from "@tabler/icons-react"
import { NavMain } from "@/components/hub/nav-main"
import { NavUser } from "@/components/hub/nav-user"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import { AdminNav } from "@/components/hub/nav-admin"
import { NavBottom } from "@/components/hub/nav-bottom"
import { ArrowLeftFromLine, WrapText } from "lucide-react"

const data = {
    user: {
        name: "shadcn",
        email: "m@example.com",
        avatar: "/assets/profile/Ander.png",
    },
    navMain: [
        {
            title: "Dashboard",
            url: "#",
            icon: IconDashboard,
        },
        {
            title: "Projets",
            url: "#",
            icon: IconFolder,
        },
        {
            title: "Equipes",
            url: "#",
            icon: IconUsers,
        },
    ],
    navAdmin: [
        {
            title: "Utilisateurs",
            url: "#",
            icon: IconSettings,
        },
        {
            title: "Articles",
            url: "#",
            icon: IconHelp,
        },
        {
            title: "Catégories",
            url: "#",
            icon: IconSearch,
        },
    ],
    navBottom: [
        {
          title: "Retour sur le site",
          url: "#",
          icon: WrapText,
        },
      ]
}

export function HubSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible="offcanvas" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
                            <div>
                                <IconChartBubbleFilled className="!size-5" />
                                <span className="text-base font-semibold">Hub Lorem News</span>
                            </div>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
                <AdminNav items={data.navAdmin} />
                <NavBottom items={data.navBottom} className="mt-auto" />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={data.user} />
            </SidebarFooter>
        </Sidebar>
    )
}
