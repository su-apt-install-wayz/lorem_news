"use client"

import { type Icon } from "@tabler/icons-react"
import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import { LoaderCircleIcon } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"

export function NavAdmin({ items }: {
    items: {
        title: string
        url: string
        icon?: Icon
    }[]
}) {
    const [loadingItem, setLoadingItem] = useState<string | null>(null);
    const router = useRouter();
    const pathname = usePathname();

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
            <SidebarGroupLabel>Administration</SidebarGroupLabel>
            <SidebarGroupContent className="flex flex-col gap-2">
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
