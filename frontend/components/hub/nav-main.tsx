"use client"

import { IconCirclePlusFilled, IconMail, type Icon } from "@tabler/icons-react"
import { SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { usePathname, useRouter } from "next/navigation"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "../ui/button"
import { cn } from "@/lib/utils"
import { LoaderCircleIcon } from "lucide-react"
import { useState } from "react"

export function NavMain({ items }: {
    items: {
        title: string
        url: string
        icon?: Icon
    }[]
}) {
    const [loadingItem, setLoadingItem] = useState<string | null>(null);
    const router = useRouter();
    const pathname = usePathname();
    const { isMobile } = useSidebar();

    const handleClick = (url: string, title: string) => {
        if (pathname === url) {
            return;
        }

        setLoadingItem(title);
        router.push(url);
        setTimeout(() => {
            setLoadingItem(null);
        }, 3000);
    };

    return (
        <SidebarGroup>
            <SidebarGroupContent className="flex flex-col gap-2">
                <SidebarMenu className={cn(isMobile && "hidden")}>
                    <SidebarMenuItem className="flex items-center gap-2">
                        <Popover>
                            <PopoverTrigger asChild>
                                <SidebarMenuButton tooltip="Création rapide" className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear">
                                    <IconCirclePlusFilled />
                                    <span>Création rapide</span>
                                </SidebarMenuButton>
                            </PopoverTrigger>
                            <PopoverContent className="w-64 p-1 flex flex-col gap-1">
                                <Button variant={"ghost"} className="justify-between" onClick={() => router.push("/hub/editor")}>
                                    <span>Créer un projet</span>
                                    <kbd className="text-xs text-muted-foreground space-x-0.5">
                                        <span>⌘</span>
                                        <span>P</span>
                                    </kbd>
                                </Button>
                                <Button variant={"ghost"} className="justify-between" onClick={() => router.push("/creation/contact")}>
                                    <span>Créer une équipe</span>
                                    <kbd className="text-xs text-muted-foreground space-x-0.5">
                                        <span>⌘</span>
                                        <span>T</span>
                                    </kbd>
                                </Button>
                                <Button variant={"ghost"} className="justify-between" onClick={() => router.push("/creation/contact")}>
                                    <span>Créer une catégorie</span>
                                    <kbd className="text-xs text-muted-foreground space-x-0.5">
                                        <span>⌘</span>
                                        <span>C</span>
                                    </kbd>
                                </Button>
                            </PopoverContent>
                        </Popover>
                        {/* <SidebarMenuButton tooltip="Création rapide" className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear">
                            <IconCirclePlusFilled />
                            <span>Création rapide</span>
                        </SidebarMenuButton> */}
                        {/* <Button size="icon" className="size-8 group-data-[collapsible=icon]:opacity-0" variant={"outline"}>
                            <IconMail />
                            <span className="sr-only">Inbox</span>
                        </Button> */}
                    </SidebarMenuItem>
                </SidebarMenu>
                <Separator />
                <SidebarMenu>
                    {items.map((item) => (
                        <SidebarMenuItem key={item.title} onClick={() => handleClick(item.url, item.title)}>
                            <SidebarMenuButton tooltip={item.title}>
                                {item.icon && <item.icon />}
                                <span>{item.title}</span>
                                {loadingItem === item.title && <LoaderCircleIcon className="animate-spin h-6 w-6 text-muted ml-auto" />}
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    )
}
