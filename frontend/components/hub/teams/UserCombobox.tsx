// components/forms/UserCombobox.tsx
"use client";

import { useEffect, useState, useTransition } from "react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { createApiServer } from "@/lib/apiServer";
import api from "@/lib/api";

interface User {
    id: number;
    username: string;
    email: string;
    picture: string;
}

export function UserCombobox({ value, onChange, placeholder = "Sélectionner un utilisateur..." }: { value: User | null; onChange: (user: User) => void; placeholder?: string; }) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [users, setUsers] = useState<User[]>([]);
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        if (!open || !search) return;

        startTransition(async () => {
            try {
                // const api = await createApiServer();
                const res = await api.get("/api/users", { params: { q: search } });
                setUsers(res.data ?? []);
            } catch (e) {
                console.error("Erreur chargement users", e);
            }
        });
    }, [search, open]);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                >
                    {value ? (
                        <div className="flex items-center gap-2">
                            <Avatar className="w-5 h-5">
                                <AvatarImage src={`/assets/profile/${value.picture}`} />
                                <AvatarFallback>{value.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <span>{value.username} ({value.email})</span>
                        </div>
                    ) : (
                        placeholder
                    )}
                    <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[350px] p-0">
                <Command>
                    <CommandInput placeholder="Rechercher..." value={search} onValueChange={setSearch} className="h-9" />
                    <CommandList>
                        <CommandEmpty>Aucun utilisateur trouvé.</CommandEmpty>
                        <CommandGroup>
                            {users.map((user) => (
                                <CommandItem
                                    key={user.id}
                                    value={user.email}
                                    onSelect={() => {
                                        onChange(user);
                                        setOpen(false);
                                    }}
                                >
                                    <div className="flex items-center gap-2">
                                        <Avatar className="w-5 h-5">
                                            <AvatarImage src={`/assets/profile/${user.picture}`} />
                                            <AvatarFallback>{user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col text-sm">
                                            <span>{user.username}</span>
                                            <span className="text-xs text-muted-foreground">{user.email}</span>
                                        </div>
                                    </div>
                                    {value?.id === user.id && <Check className="ml-auto h-4 w-4 opacity-100" />}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
