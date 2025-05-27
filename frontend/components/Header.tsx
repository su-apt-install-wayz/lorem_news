"use client";

import Image from 'next/image';
import Logo1 from '@/public/assets/logo1.png';
import { Section } from './Section';
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Separator } from '@/components/ui/separator';
import { SearchForm } from '@/components/SearchForm';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu"
import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { signOut, useSession, signIn } from 'next-auth/react';
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { useRouter } from 'next/navigation';
import { Avatar , AvatarImage } from '@/components/ui/avatar';

const components: { title: string; href: string; }[] = [
    {
        title: "All",
        href: "/articles",
    },
    {
        title: "Alert Dialog",
        href: "/docs/primitives/alert-dialog",
    },
    {
        title: "Hover Card",
        href: "/docs/primitives/hover-card",
    },
    {
        title: "Progress",
        href: "/docs/primitives/progress",
    },
    {
        title: "Scroll-area",
        href: "/docs/primitives/scroll-area",
    },
    {
        title: "Tabs",
        href: "/docs/primitives/tabs",
    },
    {
        title: "Tooltip",
        href: "/docs/primitives/tooltip",
    },
]

export const Header = () => {
    const { data: session } = useSession();
    const router = useRouter();

    return (
        <header className="sticky top-0 w-full flex flex-col justify-end items-center bg-background border-b shadow-sm z-99">
            <Section className="w-full flex flex-col justify-center items-center relative px-0">
                <div className="w-full max-w-[1500px] flex justify-between items-center gap-4 p-4 py-2">
                    <Image className="w-28" src={Logo1} alt="Logo Lorem News" />

                    <SearchForm variant='desktop' className="max-w-xl rounded-sm overflow-hidden max-sm:hidden" />

                    <div className="flex gap-3 items-center">
                        <Drawer>
                            <DrawerTrigger asChild>
                                <Button className="hidden max-sm:flex cursor-pointer w-10 h-10" variant={"ghost"} size="icon">
                                    <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z" />
                                    </svg>
                                </Button>
                            </DrawerTrigger>
                            <DrawerContent>
                                <DrawerHeader>
                                    <DrawerTitle>Recherche</DrawerTitle>
                                    <DrawerDescription>Effectuez une recherche par catégorie</DrawerDescription>
                                </DrawerHeader>
                                <div className="flex flex-col gap-3">
                                    <div className="flex flex-col gap-2">
                                        <SearchForm variant='mobile' className="flex flex-col gap-3 p-3" />
                                    </div>
                                </div>
                            </DrawerContent>
                        </Drawer>

                        {session ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button className="cursor-pointer rounded-full w-10 h-10 border-4 focus-visible:ring-0 focus-visible:border-border" variant={"link"} size="icon">
                                        <Avatar>
                                            <AvatarImage src={`/assets/profile/Ander.png`} /> {/* Replace with session.user.image if available */}
                                            <span className="sr-only">Ouvrir le menu utilisateur</span>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56 z-99">
                                    <DropdownMenuLabel className='flex flex-col'>
                                        <span>Toto Dupont</span>
                                        <span className="font-semibold truncate">toto@mail.com</span>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuGroup>
                                        <DropdownMenuItem>Paramètres</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => router.push('/hub')}>Hub Lorem News</DropdownMenuItem>
                                    </DropdownMenuGroup>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => signOut()}>Se déconnecter</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <Button onClick={() => signIn()} variant={"default"} className="rounded-xs cursor-pointer" asChild>
                                <Link href="/login">Se connecter</Link>
                            </Button>
                        )}
                    </div>
                </div>
                <Separator />
                <div className="w-full max-w-[1500px] flex items-center gap-3 p-4 py-2">
                    <NavigationMenu>
                        <NavigationMenuList>
                            <NavigationMenuItem>
                                <Link href="/" legacyBehavior passHref>
                                    <NavigationMenuLink className={`${navigationMenuTriggerStyle()} font-semibold`}>Accueil</NavigationMenuLink>
                                </Link>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuTrigger className='font-semibold cursor-pointer'>Articles</NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <ul className="grid w-[200px] grid-cols-1 sm:w-[280px] sm:grid-cols-2 md:w-[480px] md:grid-cols-3 gap-2">
                                        {components.map((component) => (
                                            <ListItem className="truncate" key={component.title} title={component.title} href={component.href}></ListItem>
                                        ))}
                                    </ul>
                                </NavigationMenuContent>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>
            </Section>
        </header>
    );
}

const ListItem = React.forwardRef<
    React.ElementRef<"a">,
    React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
    return (
        <li>
            <NavigationMenuLink asChild>
                <a
                    ref={ref}
                    className={cn(
                        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                        className
                    )}
                    {...props}
                >
                    <div className="text-sm font-medium leading-none m-0">{title}</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
                </a>
            </NavigationMenuLink>
        </li>
    )
})
ListItem.displayName = "ListItem"