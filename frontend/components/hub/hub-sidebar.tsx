"use client"

import * as React from "react"
import { IconCategory, IconChartBubbleFilled, IconDashboard, IconFolder, IconUsers, IconUsersGroup } from "@tabler/icons-react"
import { NavMain } from "@/components/hub/nav-main"
import { NavUser } from "@/components/hub/nav-user"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import { NavBottom } from "@/components/hub/nav-bottom"
import { WrapText } from "lucide-react"
import { NavProjects } from "@/components/hub/nav-projects"

const data = {
    user: {
        name: "shadcn",
        email: "m@example.com",
        avatar: "/assets/profile/Ander.png",
    },
    navMain: [
        {
            title: "Dashboard",
            url: "/hub",
            icon: IconDashboard,
        },
        {
            title: "Projets",
            url: "#",
            icon: IconFolder,
        },
        {
            title: "Equipes", // si admin = Equipes sinon Mon équipe
            url: "#",
            icon: IconUsers,
        },
        {
            title: "Utilisateurs",
            url: "/hub/users",
            icon: IconUsersGroup,
        },
        {
            title: "Catégories",
            url: "#",
            icon: IconCategory,
        }
    ],
    navProjects: [
        {
            title: "Dashboard guojsfh fdisf fshlkklf dfkhsf djdg hfgdh",
            url: "#",
        },
        {
            title: "Projets",
            url: "#",
        },
        {
            title: "Equipes",
            url: "#",
        },
        {
            title: "Dashboard",
            url: "#",
        },
        {
            title: "Projets",
            url: "#",
        },
        {
            title: "Equipes",
            url: "#",
        },
        {
            title: "Dashboard",
            url: "#",
        },
        {
            title: "Projets",
            url: "#",
        },
        {
            title: "Equipes",
            url: "#",
        },
    ],
    navBottom: [
        {
            title: "Retour sur le site",
            url: "/",
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
                <NavProjects items={data.navProjects} />
                <NavBottom items={data.navBottom} className="mt-auto" />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={data.user} />
            </SidebarFooter>
        </Sidebar>
    )
}
