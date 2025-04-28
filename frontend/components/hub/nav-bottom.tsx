"use client"

import * as React from "react"
import { LoaderCircleIcon, LucideIcon } from "lucide-react"

import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { usePathname, useRouter } from "next/navigation"

export function NavBottom({
    items,
    ...props
}: {
    items: {
        title: string
        url: string
        icon: LucideIcon
    }[]
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
    const [loadingItem, setLoadingItem] = React.useState<string | null>(null);
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
        <SidebarGroup {...props}>
            <SidebarGroupContent>
                <SidebarMenu>
                    {items.map((item) => (
                        <SidebarMenuItem key={item.title} onClick={() => handleClick(item.url, item.title)}>
                            <SidebarMenuButton asChild>
                                <a href={item.url}>
                                    <item.icon />
                                    <span>{item.title}</span>
                                    {loadingItem === item.title && <LoaderCircleIcon className="animate-spin h-6 w-6 text-muted ml-auto" />}
                                </a>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    )
}
