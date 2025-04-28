"use client"

import { Folder, Forward, Frame, MoreHorizontal, MouseIcon, Trash2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuAction, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

export function NavProjects({ items }: {
    items: {
        title: string
        url: string
    }[]
}) {
    const { isMobile } = useSidebar();
    const showMouseIcon = items.length > 6;

    return (
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <SidebarGroupLabel className="space-x-2">
                <span>Projets</span>
                {showMouseIcon && <MouseIcon />}
            </SidebarGroupLabel>
            <SidebarMenu>
                <ScrollArea className="h-[200px]">
                    {items.map((item, index) => (
                        <SidebarMenuItem key={index}>
                            <SidebarMenuButton asChild>
                                <a href={item.url}>
                                    <Frame />
                                    <span className="truncate max-w-[190px]">{item.title}</span>
                                </a>
                            </SidebarMenuButton>
                            <DropdownMenu>
                                <DropdownMenuTrigger className={cn(showMouseIcon && "mr-3")} asChild>
                                    <SidebarMenuAction showOnHover>
                                        <MoreHorizontal />
                                        <span className="sr-only">Plus</span>
                                    </SidebarMenuAction>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-48 rounded-lg" side={isMobile ? "bottom" : "right"} align={isMobile ? "end" : "start"}>
                                    <DropdownMenuItem>
                                        <Folder className="text-muted-foreground" />
                                        <span>View Project</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <Forward className="text-muted-foreground" />
                                        <span>Project Preview</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>
                                        <Trash2 className="text-muted-foreground" />
                                        <span>Delete Project</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </SidebarMenuItem>
                    ))}
                </ScrollArea>
            </SidebarMenu>
        </SidebarGroup>
    )
}
