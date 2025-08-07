"use client";

import { useState, useTransition } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { LoaderCircleIcon, XIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { UserCombobox, User } from "./UserCombobox";

export function CreateTeamDialog({ children, createTeam, searchLeaders, searchWriters }: { children: React.ReactNode; createTeam: (payload: { name: string; leaderId: number; memberIds: number[] }) => Promise<{ success: boolean; message?: string }>; searchLeaders: (query: string) => Promise<User[]>; searchWriters: (query: string) => Promise<User[]>; }) {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");
    const [leader, setLeader] = useState<User | null>(null);
    const [members, setMembers] = useState<User[]>([]);
    const [isPending, startTransition] = useTransition();

    const resetForm = () => {
        setName("");
        setLeader(null);
        setMembers([]);
    };

    const handleOpenChange = (isOpen: boolean) => {
        if (!isOpen) resetForm();
        setOpen(isOpen);
    };

    const handleSubmit = () => {
        if (!name || !leader?.id) return toast.error("Nom ou leader manquant");

        startTransition(async () => {
            const res = await createTeam({
                name,
                leaderId: leader.id,
                memberIds: members.map((m) => m.id),
            });

            if (res.success) {
                toast.success("Équipe créée");
                setOpen(false);
                resetForm();
            } else {
                toast.error(res.message ?? "Erreur inconnue");
            }
        });
    };

    const removeMember = (id: number) => {
        setMembers((prev) => prev.filter((m) => m.id !== id));
    };

    const addMember = (user: User) => {
        if (!members.find((m) => m.id === user.id)) {
            setMembers((prev) => [...prev, user]);
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Créer une équipe</DialogTitle>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="team-name">Nom</Label>
                        <Input id="team-name" value={name} onChange={(e) => setName(e.target.value)} disabled={isPending} placeholder="Rédaction Paris" />
                    </div>

                    <div className="grid gap-2">
                        <Label>Rédacteur en chef</Label>
                        <UserCombobox value={leader} onChange={setLeader} placeholder="Rechercher un leader..." fetchUsers={searchLeaders} />
                    </div>

                    <div className="grid gap-2">
                        <Label>Rédacteurs</Label>
                        <UserCombobox value={null} onChange={addMember} placeholder="Ajouter un rédacteur..." fetchUsers={searchWriters} />
                        <div className="mt-2 flex items-center gap-2 flex-wrap">
                            <TooltipProvider>
                                {members.map((member) => (
                                    <Tooltip key={member.id}>
                                        <TooltipTrigger className="cursor-pointer" asChild>
                                            <div className="relative">
                                                <div className="w-9 h-9">
                                                    <Avatar className="w-full h-full rounded-full border-2 border-muted">
                                                        <AvatarImage src={`/assets/profile/${member.picture}`} />
                                                        <AvatarFallback>{member.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                                                    </Avatar>
                                                </div>
                                                <button
                                                    onClick={() => removeMember(member.id)}
                                                    className="absolute -top-1 -right-1 bg-background border border-muted rounded-full p-0.5 text-muted-foreground hover:text-destructive cursor-pointer"
                                                >
                                                    <XIcon className="w-3 h-3" />
                                                </button>
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p className="text-sm font-medium">{member.username}</p>
                                            <p className="text-xs text-muted">{member.email}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                ))}
                                {members.length === 0 && (
                                    <p className="text-sm text-muted">Aucun membre</p>
                                )}
                            </TooltipProvider>
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Annuler</Button>
                    </DialogClose>
                    <Button onClick={handleSubmit} disabled={isPending}>
                        {isPending ? (
                            <LoaderCircleIcon className="animate-spin h-5 w-5 text-primary-foreground" />
                        ) : (
                            "Créer"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
